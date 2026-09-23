---
title: NestJS 트랜잭셔널 아웃박스
description: "@nestarc/outbox 0.3.x로 비즈니스 변경과 이벤트 기록을 같은 트랜잭션에 저장하고 안전하게 전달하는 방법을 검토하세요."
---

# NestJS 트랜잭셔널 아웃박스

트랜잭셔널 아웃박스는 비즈니스 데이터 변경과 발행할 이벤트를 같은 데이터베이스 트랜잭션에 기록합니다. 커밋 이후 worker가 미발행 레코드를 읽어 broker나 webhook 계층으로 전달합니다. 이 문서는 공개된 **0.3.0** 기준입니다. `npm ls @nestarc/outbox`로 설치 버전을 확인하고, 최신 저장소 main과 구분하여 [0.3.0 README](https://github.com/nestarc/outbox/blob/v0.3.0/README.md)를 참고하세요.

## 운영 경계

- 아웃박스는 “HTTP 202를 반환했다”는 사실을 durable delivery로 바꿔 주지 않습니다. 이벤트 레코드가 비즈니스 변경과 함께 커밋되어야 합니다.
- 전달은 일반적으로 at-least-once이므로 소비자는 event ID를 기준으로 중복 처리를 막아야 합니다.
- 0.3.0에서는 주기적 polling을 켜 둡니다. LISTEN/NOTIFY는 지연 시간을 줄이지만 시작 시 backlog, batch 초과분, 예약된 재시도, 유실된 알림을 모두 처리하도록 보장하지 않습니다.
- polling 간격, retry/backoff, dead-letter 처리, 보존 기간과 모니터링을 함께 설계합니다.
- 종료 신호에서 정리 작업이 실행되도록 `app.enableShutdownHooks()`를 호출합니다. poller의 drain 대기 상한은 30초이며, 진행 중인 handler를 강제로 취소하지 않습니다.
- 네트워크 호출은 DB 트랜잭션 안에서 직접 수행하지 않습니다.

[패키지 개요](/packages/outbox/) · [동작 원리](/packages/outbox/how-it-works) · [재시도와 backoff](/packages/outbox/retry-backoff)

## 0.3 업그레이드

Node 22/24로 전환하고 기존 poller를 모두 정지·drain한 뒤 패키지의 `src/sql/upgrade-to-current.sql`을 적용합니다. 0.2/0.3 poller를 혼합 실행하면 안 됩니다. 새 runtime은 schema를 검사하고 renewable lease, claim token, 저장된 `next_attempt_at`으로 작업 소유권과 재시도를 관리합니다.

`forRootAsync()`의 `transport`·`tenantProvider`는 factory 밖에 등록합니다. 전역 이벤트는 `tenantScope: 'global'`로 명시하고, 테넌트 관리에는 인증된 ID로 `OutboxTenantAdminService.forTenant()`를 사용합니다. 관리 mutation은 boolean 대신 `outcome`을 반환합니다. `SENT`는 후속 job 완료나 FIFO를 보장하지 않습니다. [설치 및 마이그레이션](/packages/outbox/installation)을 확인하세요.

## 설치와 AI 참조 경로

새 DB에는 앱 시작 전에 번들 SQL을 적용합니다. Prisma 7 PostgreSQL adapter를 사용하면 wakeup을 꺼도 `@prisma/adapter-pg`와 `pg`가 필요합니다. 로컬 handler는 Nest provider로 등록하고, broker에는 partition key와 별도로 event ID와 metadata를 보존합니다.

0.3.0 `listPage()`는 PostgreSQL 시각을 밀리초로 직렬화하여 페이지 경계에서 행을 누락할 수 있습니다. 완전한 데이터 추출에는 정밀도를 보존하는 별도 DB 조회가 필요합니다.

[설치 및 종료 설정](/packages/outbox/installation) · [AI 에이전트 사용 안내](/packages/outbox/agent-guide) · [버전 고정 실행 예제](https://github.com/nestarc/outbox/tree/v0.3.0/test/packed-examples)
