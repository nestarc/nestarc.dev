---
title: NestJS 멱등성 처리와 재시도 안전성
description: "@nestarc/idempotency 0.4.x의 원자적 잠금, 요청 fingerprint, 응답 replay와 exactly-once가 아닌 운영 경계를 설명합니다."
---

# NestJS 멱등성 처리와 재시도 안전성

`@nestarc/idempotency` 0.4.x는 `Idempotency-Key`를 기준으로 동시 중복 요청을 제어하고, 같은 키에 다른 payload가 사용되는 경우를 fingerprint로 구분하며, 완료된 응답을 replay합니다.

## 보장과 한계

- 저장소의 원자적 create가 동시에 들어온 요청 중 한 요청만 처리 상태를 획득하게 합니다.
- token 기반 compare-and-set이 만료 후 새 소유자의 레코드를 오래된 요청이 덮어쓰는 일을 막습니다.
- 처리 중 레코드의 TTL이 만료되면 이후 요청이 키를 다시 획득할 수 있습니다. 따라서 결제나 외부 발행 같은 비가역 side effect에는 DB unique constraint 등 별도의 멱등 경계가 필요합니다.
- 메모리 저장소는 개발용입니다. 다중 인스턴스 운영에서는 공유 Redis 또는 PostgreSQL 저장소를 사용합니다.

[동작 원리](/packages/idempotency/how-it-works) · [저장소 어댑터](/packages/idempotency/storage) · [IETF Idempotency-Key 초안](https://datatracker.ietf.org/doc/draft-ietf-httpapi-idempotency-key-header/)
