---
title: NestJS 트랜잭셔널 아웃박스
description: "@nestarc/outbox 0.2.x로 비즈니스 변경과 이벤트 기록을 같은 트랜잭션에 저장하고 안전하게 전달하는 방법을 검토하세요."
---

# NestJS 트랜잭셔널 아웃박스

트랜잭셔널 아웃박스는 비즈니스 데이터 변경과 발행할 이벤트를 같은 데이터베이스 트랜잭션에 기록합니다. 커밋 이후 worker가 미발행 레코드를 읽어 broker나 webhook 계층으로 전달합니다.

## 운영 경계

- 아웃박스는 “HTTP 202를 반환했다”는 사실을 durable delivery로 바꿔 주지 않습니다. 이벤트 레코드가 비즈니스 변경과 함께 커밋되어야 합니다.
- 전달은 일반적으로 at-least-once이므로 소비자는 event ID를 기준으로 중복 처리를 막아야 합니다.
- polling 간격, retry/backoff, dead-letter 처리, 보존 기간과 모니터링을 함께 설계합니다.
- 네트워크 호출은 DB 트랜잭션 안에서 직접 수행하지 않습니다.

[패키지 개요](/packages/outbox/) · [동작 원리](/packages/outbox/how-it-works) · [재시도와 backoff](/packages/outbox/retry-backoff)
