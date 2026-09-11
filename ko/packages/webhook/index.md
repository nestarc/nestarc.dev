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

[서명과 보안](/packages/webhook/security) · [비밀키 회전](/packages/webhook/endpoint-management) · [운영과 데이터 보존](/packages/webhook/operations)

## 0.13.1 배포판의 제약

0.13.1에서는 `correlationId`만 넘기면 저장되지 않으므로 `idempotencyKey`와 함께 사용해야 합니다. 이벤트 replay로 생성하는 전달 작업의 총 시도 횟수는 `delivery.maxRetries` 설정과 관계없이 5회입니다. 보존 정책으로 payload가 삭제된 실패 이벤트는 수동·일괄 재시도 전에 호스트 애플리케이션에서 차단해야 합니다. 이 세 가지 제약을 수정한 소스 버전은 **0.13.2이며, npm 배포 전 상태**입니다. 로컬에서 패키징한 0.13.2로 수정 사항을 검증할 수 있지만, 설치한 0.13.1의 동작은 릴리스와 업그레이드 전까지 바뀌지 않습니다. [변경 이력](https://github.com/nestarc/webhook/blob/main/CHANGELOG.md)을 확인하세요.
