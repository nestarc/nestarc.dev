---
title: NestJS 트랜잭셔널 인박스와 메시지 중복 처리 방지
description: "@nestarc/inbox 0.2.0으로 NestJS·Prisma·PostgreSQL에서 웹훅과 broker 이벤트를 영속적으로 수신하고, 중복 DB 변경 방지·재시도·장애 복구를 구성하세요."
---

# NestJS 트랜잭셔널 인박스와 메시지 중복 처리 방지

`@nestarc/inbox`는 **NestJS, Prisma, PostgreSQL**을 위한 트랜잭셔널 인박스입니다. 수신 이벤트를 먼저 데이터베이스에 저장하고, worker가 비즈니스 변경과 처리 완료 상태를 하나의 트랜잭션으로 커밋합니다. 웹훅 재시도나 메시지 broker의 재전달이 발생해도, 보관 중인 동일 메시지의 커밋된 DB 작업이 반복되지 않도록 합니다.

이 문서는 npm에 배포된 **0.2.0 · SQL schema v2** 기준입니다. 0.1.0에서 업그레이드할 때 SQL 마이그레이션은 필요하지 않습니다. 사이트에서는 **Preview**로 분류하며, 1.0 이전에는 API와 스키마가 변경될 수 있습니다.

[영문 사용 문서](/packages/inbox/) · [설치](/packages/inbox/installation) · [API 참조](/api/inbox/) · [npm 패키지](https://www.npmjs.com/package/@nestarc/inbox) · [0.2.0 소스](https://github.com/nestarc/inbox/tree/v0.2.0)

## 어떤 문제를 해결하나요?

이벤트를 받자마자 HTTP 성공 응답이나 ACK를 보낸 뒤 프로세스가 종료되면, 처리되지 않은 이벤트를 잃을 수 있습니다. 반대로 DB 변경 후 ACK 전에 종료되면 같은 이벤트를 다시 받습니다. Inbox는 **수신 기록의 커밋**과 **비즈니스 처리의 커밋**을 분리하고 각각의 복구 경계를 관리합니다.

1. 애플리케이션이 발신자를 인증하고 신뢰할 수 있는 tenant scope와 이벤트 ID를 결정합니다.
2. `InboxService.accept()`가 PostgreSQL에 수신 기록을 저장합니다.
3. `accepted` 또는 `duplicate` 결과를 받은 뒤 애플리케이션이 ACK·offset commit·메시지 삭제·HTTP 성공 응답을 수행합니다.
4. 활성화된 worker가 수신 기록을 확보하고 handler를 실행합니다.
5. handler의 `context.tx`로 수행한 DB 변경과 inbox 완료 상태를 함께 커밋합니다. 실패하면 함께 롤백하고, 저장된 일정에 따라 재시도합니다.

**수신 성공은 처리 완료가 아닙니다.** `duplicate`도 현재 처리 상태를 바꾸지 않습니다. `accept()`가 실패하거나 커밋 여부가 불확실하면 성공 응답을 보내지 않고, 같은 식별자로 재전달해야 합니다. 인증 실패·잘못된 입력·식별자 충돌에는 별도의 거부 또는 dead-letter 정책이 필요합니다.

## 메시지 식별자와 보장 범위

중복 판정의 기준은 **scope + source + consumer + message ID**입니다. 같은 식별자와 같은 내용은 `duplicate`, 같은 식별자에 다른 내용은 `InboxConflictError`가 됩니다. 재시도 때마다 새 ID를 생성하면 같은 메시지로 인식하지 못합니다.

- handler는 실패 후 다시 호출될 수 있습니다. 보장 대상은 수신 기록이 보관되는 동안 **제공된 트랜잭션에서 성공적으로 커밋된 DB 변경**입니다.
- 모든 비즈니스 쓰기는 `context.tx`를 사용합니다. 별도의 Prisma client, 다른 데이터베이스, HTTP 호출이나 이메일 전송은 같은 원자적 커밋에 포함되지 않습니다.
- 외부 작업에는 별도의 멱등성 계약이나 [outbox](/packages/outbox/)가 필요합니다. 같은 DB 트랜잭션에 후속 outbox 이벤트를 기록할 수 있습니다.
- 서로 다른 이벤트 ID가 같은 주문·결제 작업을 나타내는 경우에는 애플리케이션의 비즈니스 키와 제약조건도 필요합니다.
- 메시지 처리 순서는 보장하지 않습니다. 수신 기록 삭제나 오래된 DB 백업 복원은 중복 판정 이력을 줄입니다.

[메시지 처리와 트랜잭션 경계](/packages/inbox/processing)

## 설치 조건과 첫 실행

| 구성 요소 | 0.2.0 기준 |
| --- | --- |
| NestJS | `^11.2.8` |
| Prisma client | `^7.10.1` |
| PostgreSQL | 통합·프로세스 종료 복구 테스트는 16과 18에서 수행 |
| Node.js | 패키지 engine은 `>=22.12.0`; 전체 검증과 선택적 tenancy 예제는 22.23.4+ 또는 24.22.1+ 기준 |
| 선택적 tenancy | `@nestarc/tenancy ^0.16.2`; core 실행에는 불필요 |

Nest core, `reflect-metadata`, `rxjs`도 peer로 선언되어 있습니다. 실제 의존성 범위는 [배포 버전의 package.json](https://github.com/nestarc/inbox/blob/v0.2.0/package.json)에서 확인하세요.

기존 NestJS 11·Prisma 7 애플리케이션에서 설치합니다.

```sh
npm install @nestarc/inbox@0.2.0
npm install @prisma/adapter-pg@7.10.1
node -p "require.resolve('@nestarc/inbox/sql/create-inbox-table.sql')"
```

마지막 명령이 출력하는 SQL 파일을 애플리케이션의 마이그레이션 이력에 포함하고 **Inbox 시작 전에 적용**하세요. runtime은 스키마를 검사하며 테이블을 자동 생성하거나 업그레이드하지 않습니다. 로컬 개발 빌드의 schema v1이 남아 있다면 [schema v2 마이그레이션](https://github.com/nestarc/inbox/blob/v0.2.0/CHANGELOG.md#upgrade-action-schema-version-2)을 따릅니다.

`InboxModule.forRoot()` 또는 의존성을 주입하는 `forRootAsync()`에 기존 Prisma client와 handler를 등록합니다. worker는 opt-in이므로 `worker: { enabled: true }`로 활성화합니다. 기본 polling 간격은 1,000ms이며 수신 API가 handler 완료를 기다리지는 않습니다. 종료 시 Nest 애플리케이션을 먼저 닫고, 애플리케이션이 소유한 Prisma client를 나중에 해제합니다.

[전체 설치 예제](/packages/inbox/installation) · [실행 가능한 통합 예제](https://github.com/nestarc/inbox/tree/v0.2.0/examples)

## 재시도, 복구와 테넌트 운영

PostgreSQL lease와 claim token이 worker 소유권을 관리하고, 재시도 시각은 데이터베이스에 저장됩니다. 영구 오류나 시도 횟수 소진은 `DEAD`로 전환됩니다. 운영자는 원인을 해결한 뒤 예상 version으로 재대기시킬 수 있습니다.

완료된 메시지의 명시적 replay는 원본을 보존하면서 **새 수신 기록**을 만듭니다. 비즈니스 작업을 다시 실행하도록 허용하는 동작이므로 일반적인 중복 수신과 구분하세요. 완료 payload 정리는 중복 판정 fingerprint와 replay 계보를 유지하지만, 수신 기록 자체를 삭제하면 그 이력을 잃습니다.

테넌트 관리는 인증된 ID로 `InboxAdminService.forTenant(id)`를 사용합니다. scope가 메시지 식별자에 포함되는 것만으로 DB의 RLS가 구성되지는 않습니다. RLS 정책과 제한된 DB 역할은 애플리케이션이 준비하며, 선택적 `createInboxTenancyContext()` adapter로 context 적용을 연결할 수 있습니다.

[재시도·DEAD·replay·보존 정책](/packages/inbox/operations) · [검증 기록과 남은 운영 검증](https://github.com/nestarc/inbox/blob/v0.2.0/docs/validation.md)

## 0.2.0 테스트 헬퍼와 운영 검증

새 `@nestarc/inbox/testing` 경로에서 실제 PostgreSQL 테스트 DB와 handler를 사용하는 헬퍼를 제공합니다.

- `drainInbox(inbox, admin, receiptIds, options)`는 실제 `runOnce()`를 실행하며 지정한 수신 기록이 모두 `COMPLETED`가 될 때까지 기다립니다. ID 목록은 확인할 결과를 선택할 뿐, worker의 claim 범위를 제한하지 않습니다. 격리된 DB나 전용 test consumer를 사용하세요.
- `waitForInboxRecord(admin, receiptId, options)`는 이미 실행 중인 worker의 결과만 조회합니다. 기본 목표는 `COMPLETED`이며 `DEAD`도 지정할 수 있습니다.
- 두 헬퍼는 timeout·poll 간격·최대 확인 횟수·`AbortSignal`을 지원합니다. `InboxTestError`는 payload나 tenant 값 없이 상태와 시도 횟수 snapshot을 제공합니다. timeout이나 취소가 이미 실행 중인 트랜잭션까지 취소하지는 않으므로, Prisma 연결을 해제하기 전에 Inbox를 닫습니다.

실제 timer를 사용하고 수신 기록의 완료뿐 아니라 애플리케이션의 업무 row와 outbox 결과도 검증하세요. [테스트 가이드와 예제](/packages/inbox/testing)에서 기본값과 오류 계약을 확인할 수 있습니다.

운영 검증에는 TCP 단절·blackhole, pool 포화, 실제 SIGTERM drain, PostgreSQL standby 승격, 제한된 업무 tablespace의 공간 부족, RabbitMQ 재시작·retry·DLQ가 추가됐습니다. standby의 WAL replay를 확인한 뒤 승격했으며, 공간 부족 테스트는 Inbox 상태 저장 공간이 남아 있는 16 MiB 업무 tablespace를 사용했습니다. 임의의 비동기 failover에서 무손실이나 WAL 볼륨 고갈 복구를 보장하는 결과는 아닙니다.

[디스크 기반 동시 수신 측정](https://github.com/nestarc/inbox/blob/v0.2.0/docs/benchmarks/2026-10-28-sustained-local.md)은 각 실행에서 120초 동안 19,199건을 수신하고 약 94–95초 뒤 backlog를 해소했습니다. 의도적 rollback·retry를 포함해 수신 기록마다 업무 효과 한 건을 확인했습니다. 로컬 Docker VM에서 수분 동안 측정한 결과이며 최대 처리량·테넌트 공정성·운영 SLA를 뜻하지 않습니다. 실제 서비스 도입 검증은 이번 범위에 포함되지 않았습니다. [운영 검증 범위](/packages/inbox/operations#operational-validation)를 배포 환경과 비교하세요.

## 다른 nestarc 패키지와의 역할 구분

| 필요한 기능 | 참조할 패키지 |
| --- | --- |
| 수신 이벤트 저장과 DB 처리 중복 방지 | `@nestarc/inbox` |
| 비즈니스 쓰기와 발행할 이벤트를 같은 트랜잭션으로 기록 | [outbox](/ko/packages/outbox/) |
| HTTP 요청의 `Idempotency-Key`와 응답 replay | [idempotency](/ko/packages/idempotency/) |
| 백그라운드 작업 handler와 local/BullMQ 실행 | [jobs](/packages/jobs/) |
| 고객 HTTP 엔드포인트로 HMAC 서명 웹훅 발송 | [webhook](/ko/packages/webhook/) |

Inbox core에는 별도 cache나 broker가 필요하지 않습니다. RabbitMQ, Kafka, SQS 호환 시스템, BullMQ, 서명된 웹훅과의 연결 및 ACK 정책은 애플리케이션이 소유합니다. [버전이 고정된 예제](https://github.com/nestarc/inbox/blob/v0.2.0/examples/README.md)에서 통합 순서를 확인하세요.
