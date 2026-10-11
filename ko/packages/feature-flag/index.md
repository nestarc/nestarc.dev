---
title: NestJS 데이터베이스 기반 기능 플래그
description: "@nestarc/feature-flag 0.6.0의 속성 override, percentage rollout, 캐시와 Prisma 7 호환 경계를 한국어로 확인하세요."
---

# NestJS 데이터베이스 기반 기능 플래그

`@nestarc/feature-flag` 0.6.0은 Prisma 7과 PostgreSQL을 사용하는 데이터베이스 기반 기능 플래그입니다. 플래그 레코드와 override는 캐시할 수 있고, 특정 테넌트·사용자·환경을 고정 컬럼이 아닌 `attributes` 객체로 타기팅합니다.

## 평가 순서

1. 보관된(archived) 플래그는 `false`
2. 컨텍스트와 모든 속성이 일치하는 최적 override
3. 안정적인 targeting key를 사용한 percentage rollout
4. 전역 `enabled` 기본값

여러 override가 일치하면 속성 수, `priority`, 생성 시각, ID 순으로 결정됩니다. rollout 비율을 넓히는 동안 동일 사용자가 같은 bucket을 유지하도록 식별자를 안정적으로 유지하세요.

[설치와 Prisma 7 요구사항](/packages/feature-flag/installation) · [Rollout](/packages/feature-flag/rollout) · [Override](/packages/feature-flag/tenant-overrides)

## 설치부터 첫 성공까지

[설치 가이드](/packages/feature-flag/installation)는 패키지 설치 → Prisma 모델·SQL 제약조건 → 마이그레이션·클라이언트 생성 → 모듈 등록 → 플래그 생성 → HTTP 200 확인을 연결합니다. 필수 peer dependencies는 설치해야 하며, 별도 외부 기능 플래그 서비스는 필요하지 않습니다.

## 0.6.0의 변경 사항과 업그레이드

배포된 **0.6.0**은 명시적 `targetingKey`를 서비스 평가까지 전달하고, typed client의 registry `bucketBy`와 `evaluateAll()`의 모듈 registry `bucketBy`를 적용합니다. 호출별 `bucketBy` 옵션은 Admin 평가 API에서도 사용할 수 있습니다. 비어 있지 않은 `targetingKey`가 우선하며, 그다음 호출 옵션 → 모듈 registry → 플래그 metadata 순으로 선택한 `bucketBy`의 값을 사용합니다. 적절한 값이 없으면 `userId ?? tenantId`로 돌아갑니다.

`repository` / `tenantContextProvider` 인스턴스를 동기·비동기 모듈 옵션으로 등록할 수 있고, 커스텀 repository가 있으면 Prisma 인스턴스는 생략할 수 있습니다. OpenFeature SDK와 호환되는 boolean provider도 제공하며, 공개 타입 사용에는 `@openfeature/server-sdk@^1.23.0`이 필요합니다. 문자열·숫자·객체 플래그는 지원하지 않습니다.

0.5.0에서 올릴 때 **데이터베이스 마이그레이션은 필요하지 않습니다**. 다만 이전에 무시되던 `targetingKey`나 registry `bucketBy`가 적용되어 일부 사용자의 비율 배포 결과가 바뀔 수 있으므로 기존 대상군을 확인하세요. `percentage`는 0~100 정수여야 하며 null과 소수는 거부됩니다. [0.6.0 릴리스 노트](https://github.com/nestarc/nestjs-feature-flag/blob/v0.6.0/CHANGELOG.md)에서 변경 범위를 확인할 수 있습니다.

`enabled: false`는 최종 기본값이므로 활성 비율 배포나 허용 override를 강제로 끄지 않습니다. `percentage: 0`과 함께 설정하고 허용 override도 정리하거나 플래그를 보관해야 합니다. Redis 무효화는 최선 노력 방식이며 즉시 일관성을 보장하지 않습니다. 30초 TTL은 기본값입니다.

[AI 에이전트 사용 가이드와 버전별 제약](/packages/feature-flag/agent-guide) · [캐시](/packages/feature-flag/cache-adapters) · [배포 버전 API](/api/feature-flag/)
