---
title: NestJS 트랜잭셔널 아웃박스
description: "@nestarc/outbox 0.4.1의 필수 polling, 정밀한 관리 cursor, 설정 검증과 트랜잭셔널 이벤트 전달을 확인하세요."
---

# NestJS 트랜잭셔널 아웃박스

트랜잭셔널 아웃박스는 비즈니스 데이터 변경과 발행할 이벤트를 같은 데이터베이스 트랜잭션에 기록합니다. 커밋 이후 worker가 미발행 레코드를 읽어 broker나 webhook 계층으로 전달합니다. 이 문서는 공개된 **0.4.1** 기준입니다. `npm ls @nestarc/outbox`로 설치 버전을 확인하고 [0.4.1 README](https://github.com/nestarc/outbox/blob/v0.4.1/README.md)와 [사용 참조 문서](https://github.com/nestarc/outbox/blob/v0.4.1/USAGE.md)를 참고하세요.

## 운영 경계

- 이벤트 레코드가 비즈니스 변경과 같은 트랜잭션에서 커밋되어야 합니다. HTTP 202 응답만으로 durable delivery가 보장되지는 않습니다.
- 전달은 at-least-once이므로 소비자는 event ID를 기준으로 부수 효과의 중복 실행을 막아야 합니다.
- 0.4.1은 주기적 polling을 필수로 요구합니다. `polling.enabled: false`는 LISTEN/NOTIFY 연결 여부와 관계없이 초기화 중 `OutboxConfigurationError` (`OUTBOX_INVALID_CONFIGURATION`)로 거부됩니다. 알림은 지연 시간을 줄이고, polling은 backlog·예약된 재시도·만료된 claim을 찾습니다.
- polling 간격, retry/backoff, dead-letter 처리, 보존 기간과 모니터링을 함께 설계합니다.
- 0.4.1은 `OutboxPoller.stop({ timeoutMs })`를 공개합니다. Jobs와 함께 쓰면 `stop()`을 기다린 뒤 `app.close()`를 호출하는 단일 종료 핸들러를 사용합니다. 기본 대기는 30초이며, `OUTBOX_SHUTDOWN_INCOMPLETE` 발생 시 Jobs·Prisma를 열어 둔 채 완료 후 다시 기다립니다. 타임아웃은 작업을 취소하지 않습니다. 자동 Nest 신호 종료를 중복 등록하지 마세요.
- 네트워크 호출은 DB 트랜잭션 안에서 직접 수행하지 않습니다.

[패키지 개요](/packages/outbox/) · [동작 원리](/packages/outbox/how-it-works) · [재시도와 backoff](/packages/outbox/retry-backoff)

## 0.4 업그레이드

0.4.0에서 0.4.1로 올리면 자동 종료 hook도 drain 미완료 시 오류를 반환합니다. 기존의 경고 로그 후 반환 동작에 의존하지 말고, `OutboxShutdownError`를 처리하면서 작업 의존성을 유지하세요.

현재 0.3.0 DB schema를 사용 중이면 **추가 SQL 마이그레이션은 없습니다**. 다음 애플리케이션 변경을 적용합니다.

1. `polling.enabled: false` 설정을 제거하거나 `true`로 바꿉니다.
2. 저장한 `listPage()` v1 cursor를 폐기하고 첫 페이지부터 다시 조회합니다. v2 cursor는 PostgreSQL의 마이크로초 정밀도를 보존해 0.3.0의 페이지 경계 누락 문제를 해결합니다. v1 cursor는 `OUTBOX_INVALID_CURSOR`로 거부됩니다.
3. tenant policy/provider, hook, notification 옵션을 확인합니다. 잘못된 객체 형태나 함수가 아닌 callback은 초기화 중 거부됩니다. 이 검사가 외부 연결이나 callback 동작까지 보장하지는 않습니다.

페이지 사이에는 같은 필터와 응답의 `nextCursor`를 그대로 전달합니다. 공개 레코드의 날짜는 여전히 JavaScript `Date`이므로 cursor를 다시 만들 수 없습니다. [0.4 설정·cursor 업그레이드 안내](https://github.com/nestarc/outbox/blob/v0.4.1/README.md#upgrading-to-040)를 확인하세요.

### 0.1/0.2에서 업그레이드하는 경우

Node 22/24로 전환하고 기존 poller를 모두 정지·drain한 뒤 현재 패키지의 `src/sql/upgrade-to-current.sql`을 적용합니다. 0.2 poller를 0.3/0.4 poller와 혼합 실행하면 안 됩니다. runtime은 schema를 검사하고 renewable lease, claim token, 저장된 `next_attempt_at`으로 작업 소유권과 재시도를 관리합니다.

`forRootAsync()`의 `transport`·`tenantProvider`는 factory 밖에 등록합니다. 전역 이벤트는 `tenantScope: 'global'`로 명시하고, 테넌트 관리에는 인증된 ID로 `OutboxTenantAdminService.forTenant()`를 사용합니다. 관리 mutation은 boolean 대신 `outcome`을 반환합니다. `SENT`는 후속 job 완료나 FIFO를 보장하지 않습니다. [설치 및 마이그레이션](/packages/outbox/installation)을 확인하세요.

## 설치와 AI 참조 경로

PostgreSQL만 지원하며 PostgreSQL 16이 자동 검증 기준입니다. 더 낮은 최소 버전은 검증되지 않았습니다. NestJS 10/11/12에는 각각 Schedule 4/5/12를 사용하고 Prisma 5/6/7을 지원합니다. 새 DB에는 앱 시작 전에 번들 SQL을 적용합니다. Prisma 7 PostgreSQL adapter를 사용하면 wakeup을 꺼도 `@prisma/adapter-pg`와 `pg`가 필요합니다.

`@nestarc/jobs` 0.4.2의 Outbox peer 범위는 `^0.2.1 || ^0.3.0 || ^0.4.0`입니다. [Jobs bridge 예제](/packages/jobs/outbox-bridge)는 Outbox 0.4.1과 Jobs 0.4.2를 함께 설치하며, 공통 NestJS 지원 범위는 10/11입니다. API 전용 프로세스에는 `OutboxEmitter`만 등록하고, relay는 polling을 유지합니다. 종료 순서는 Outbox `stop()` → `app.close()` → Prisma 연결 종료입니다.

로컬 handler는 Nest provider로 등록하고, broker에는 partition key와 별도로 event ID와 metadata를 보존합니다. 패키지에 포함된 quick start는 전체 앱 코드와 DB 변경·중복 방지 receipt를 같은 트랜잭션에 기록하는 소비자 예제를 제공합니다.

[설치 및 종료 설정](/packages/outbox/installation) · [AI 에이전트 사용 안내](/packages/outbox/agent-guide) · [실행 가능한 quick start](https://github.com/nestarc/outbox/tree/v0.4.1/examples/quick-start) · [버전 고정 검증 예제](https://github.com/nestarc/outbox/tree/v0.4.1/test/packed-examples)
