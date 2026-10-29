---
title: NestJS 웹훅 발송과 PostgreSQL 전달 큐
description: "@nestarc/webhook으로 NestJS에서 서명된 웹훅을 발송하고, 테넌트 범위·재시도·중복 수신·비밀키 회전의 운영 조건을 확인하세요."
---

# NestJS 웹훅 발송과 PostgreSQL 전달 큐

`@nestarc/webhook`은 NestJS 애플리케이션에서 고객의 HTTP 엔드포인트로 이벤트를 보내는 outbound webhook 패키지입니다. 기존 PostgreSQL에 이벤트와 전달 작업을 저장하고, worker가 HMAC 서명·재시도·전달 이력 기록을 수행합니다.

[전체 사용 문서](/packages/webhook/) · [AI 에이전트 사용 가이드](/packages/webhook/agent-guide) · [API 참조](/api/webhook/) · [npm 패키지](https://www.npmjs.com/package/@nestarc/webhook)

## 첫 전송 순서

1. [설치 가이드](/packages/webhook/installation)에 따라 의존성, PostgreSQL 테이블, Prisma 클라이언트와 `WebhookModule`을 준비합니다.
2. 수신 URL, 구독할 이벤트와 필요한 테넌트 ID로 [엔드포인트를 등록](/packages/webhook/endpoint-management)합니다. 반환된 비밀키를 수신 측에 안전하게 전달합니다.
3. 등록한 이벤트를 [발행](/packages/webhook/sending-events)하고, [전달 이력](/packages/webhook/delivery-logs)과 수신 결과를 확인합니다.

발행 시 일치하는 활성 엔드포인트가 없으면 이벤트만 저장됩니다. 이후 엔드포인트를 등록해도 기존 이벤트의 전달 작업이 자동으로 만들어지지는 않습니다.

## 테넌트와 전달 범위

- `send()`는 테넌트 필터 없이 이벤트가 일치하는 모든 활성 엔드포인트를 대상으로 합니다. 테넌트 없는 엔드포인트에만 보내는 API가 아닙니다.
- `sendToTenant()`는 지정한 테넌트의 일치하는 활성 엔드포인트에 전달합니다. 테넌트별 이벤트는 인증된 테넌트 ID로 범위를 지정하세요.
- 발행 시 받은 이벤트 ID는 큐에 기록된 이벤트를 식별합니다. 수신 서버의 처리 완료를 뜻하지 않습니다.

## 운영 시 알아야 할 조건

- 전달은 at-least-once 방식이므로 수신 서버가 같은 요청을 다시 받을 수 있습니다. `SKIP LOCKED`는 여러 worker가 같은 대기 작업을 동시에 확보하는 일을 방지하지만 HTTP 처리 결과와 DB 기록을 하나의 트랜잭션으로 묶지는 않습니다. 수신 측은 `webhook-id`를 저장하고 중복 처리를 막아야 합니다.
- 서명 검증에는 수신한 원본 요청 본문을 사용합니다. `verifyWithTolerance()`의 시간 검증은 오래된 요청을 거부하는 기능이며, 허용 시간 안의 중복 요청을 식별하지는 않습니다.
- 전달 작업은 생성 당시의 URL과 서명 비밀키를 보관합니다. 비밀키 회전의 이전 키 만료 여부도 작업 생성 시점에 확인하므로, 회전 전에 만든 작업은 기존 키를 유지하고 회전 기간에 만든 작업은 만료 후 재시도에도 저장된 두 키를 사용할 수 있습니다.
- 엔드포인트 비활성화는 새 전달 작업 생성을 막습니다. 이미 대기 중인 작업을 취소하지는 않습니다.
- `delivery.maxRetries`는 최초 전송을 포함한 총 시도 횟수입니다. 기본값 5는 최초 1회와 재시도 최대 4회를 뜻합니다.
- 기본 Prisma 저장소는 circuit breaker의 cooldown 복구 시 연속 실패 횟수를 0으로 초기화합니다. 이미 대기 중인 전달이 성공하면 cooldown 전에도 circuit breaker가 비활성화한 엔드포인트를 다시 활성화할 수 있습니다.
- `sendTestEvent()`는 `{ test: true }`를 담은 `webhook.test` 이벤트에 시도 1회를 부여하며, 비활성 상태와 구독 필터를 우회합니다. 이 진단 작업도 애플리케이션에서 권한을 검사해야 합니다.

[서명과 보안](/packages/webhook/security) · [비밀키 회전](/packages/webhook/endpoint-management) · [운영과 데이터 보존](/packages/webhook/operations)

## 0.13.3 배포판

이 문서는 npm에 배포된 **0.13.3**을 기준으로 합니다. 암호화 vault를 사용하는 엔드포인트 생성 응답이 수정되었으며, 0.13.2에 도입된 동작도 유지합니다.

- `createEndpoint()`는 암호화 vault를 사용해도 평문 서명 비밀키를 생성 응답에서 한 번 반환합니다. 기본 저장소에는 암호화한 값이 저장되고 목록·조회 응답에서는 비밀키가 제외됩니다.
- 모든 발행 메서드가 `idempotencyKey` 없이도 `correlationId`를 저장합니다. 같은 멱등 키로 다시 발행하면 기존 이벤트 ID와 원래 payload·메타데이터를 유지합니다.
- 이벤트 replay로 생성한 전달 작업도 `delivery.maxRetries`에 지정한 총 시도 횟수를 사용합니다.
- 기본 Prisma 저장소는 payload가 삭제된 이벤트의 수동·일괄 재시도를 차단하고 replay를 거부합니다. 재시도·replay·보존 정책 정리가 이벤트 행 잠금을 공유하여 새로 대기열에 넣은 payload가 동시에 삭제되지 않도록 합니다.

0.13.0–0.13.2까지 마이그레이션한 데이터베이스에는 추가 SQL 변경이 없습니다. 사용자 정의 저장소는 선택적 correlation 메타데이터·replay 시도 횟수 인자와 payload 보존 조정을 직접 반영해야 합니다. `reason`은 기본 저장소에 저장되지 않으므로 운영자 작업 이력이 필요하면 애플리케이션에서 기록하세요.

0.13.3에서는 `createEndpoint()`가 반환한 `secret`을 수신 측에 안전하게 제공할 수 있습니다. `rotateSecret()`도 새 평문 서명 비밀키를 한 번 반환합니다. 0.13.2를 계속 사용하는 애플리케이션은 생성 전에 비밀키를 만들어 전달하고 원래 값을 직접 제공해야 합니다. 암호문이 255자를 넘는다면 현재 비밀키 컬럼도 확장해야 합니다. [vault 설정과 버전별 키 제공 예제](/packages/webhook/custom-adapters#webhooksecretvault)를 참고하세요.

[업그레이드 안내](/packages/webhook/installation#upgrade-to-0-13-3) · [0.13.3 변경 이력](https://github.com/nestarc/webhook/blob/v0.13.3/CHANGELOG.md) · [실행 가능한 NestJS/Prisma 7 예제](https://github.com/nestarc/webhook/tree/v0.13.3/examples/quick-start)
