---
title: NestJS 멱등성 처리와 재시도 안전성
description: "@nestarc/idempotency 1.0.0의 요청 격리, 응답 replay, 처리 lease와 0.4 마이그레이션 조건을 설명합니다."
---

# NestJS 멱등성 처리와 재시도 안전성

`@nestarc/idempotency` **1.0.0**은 NestJS의 Express/Fastify HTTP 요청을 대상으로 중복 실행을 제어합니다. 같은 키와 fingerprint의 완료된 요청은 응답을 replay하고, 처리 중인 중복 요청은 `409`, 다른 payload로 재사용한 키는 `422`를 반환합니다.

## 1.0에서 바뀐 계약

- Node.js **22 또는 24**, NestJS **10 또는 11**을 지원합니다. Node 20은 지원 대상에서 제외되었습니다.
- Redis는 `@nestarc/idempotency/redis`, Postgres와 sweep 서비스는 `@nestarc/idempotency/postgres`에서 가져옵니다.
- 저장소 키는 버전이 포함된 해시 주소를 사용합니다. 사용자 정의 scope는 인증된 tenant/user 식별자를 HTTP method와 실제 경로에 **추가**합니다.
- 헤더는 하나의 원시 문자열입니다. 중복·쉼표 연결·빈 값 등을 거부하고, 기본 길이 제한은 **UTF-8 255바이트**입니다.
- 응답 변환이 끝난 plain JSON을 저장합니다. 지원하지 않는 응답은 캐시하지 않으며 기존 `PROCESSING` lease를 유지합니다.
- 관측 이벤트의 `scope`가 해시 `namespace`로 바뀌고, 오류는 고정된 `code`/`operation`으로 분류됩니다.

## 0.4에서 업그레이드

1.0은 기존 키와 응답 포맷을 자동으로 읽거나 변환하지 않습니다. **별도의 비어 있는 저장소 영역**, 과거 명령까지 포함하는 영속적 비즈니스 중복 방지, 구버전·신버전 실행이 겹치지 않는 일괄 전환이 필요합니다. 새 Redis prefix만 지정하거나 캐시 TTL이 끝나기를 기다리는 것으로는 이미 수행된 결제·주문이 다시 실행되는 일을 막을 수 없습니다.

[1.0 마이그레이션 가이드](/packages/idempotency/migration)에서 전환 및 롤백 절차를 확인하세요. PostgreSQL의 1.0 전환에는 새 컬럼이 필요하지 않지만, 기존 테이블과 분리된 새 테이블 또는 별도 저장소가 필요합니다.

## 보장과 한계

원자적 create와 token 기반 compare-and-set은 한 레코드의 소유권과 완료 응답을 보호합니다. 처리 lease가 만료되면 원래 작업이 계속 실행 중이어도 다음 요청이 키를 획득할 수 있습니다. DB의 unique command/inbox와 외부 서비스의 중복 방지·결과 대조가 별도로 필요합니다.

인증과 권한 검사는 replay에서도 실행되는 guard에 배치하고, idempotency interceptor는 응답 serializer보다 먼저 등록합니다. 메모리 저장소는 재시작 시 사라지고 여러 프로세스를 조정하지 않으므로 운영에서는 공유 Redis 또는 PostgreSQL을 사용합니다.

[설치](/packages/idempotency/installation) · [동작 원리](/packages/idempotency/how-it-works) · [저장소 어댑터](/packages/idempotency/storage) · [1.0.0 변경 이력](https://github.com/nestarc/idempotency/blob/v1.0.0/CHANGELOG.md)
