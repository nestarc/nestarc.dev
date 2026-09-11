---
title: NestJS 데이터베이스 기반 기능 플래그
description: "@nestarc/feature-flag 0.5.0의 속성 override, percentage rollout, 캐시와 Prisma 7 호환 경계를 한국어로 확인하세요."
---

# NestJS 데이터베이스 기반 기능 플래그

`@nestarc/feature-flag` 0.5.0는 Prisma 7과 PostgreSQL을 사용하는 데이터베이스 기반 기능 플래그입니다. 플래그 레코드와 override는 캐시할 수 있고, 특정 테넌트·사용자·환경을 고정 컬럼이 아닌 `attributes` 객체로 타기팅합니다.

## 평가 순서

1. 보관된(archived) 플래그는 `false`
2. 컨텍스트와 모든 속성이 일치하는 최적 override
3. 안정적인 targeting key를 사용한 percentage rollout
4. 전역 `enabled` 기본값

여러 override가 일치하면 속성 수, `priority`, 생성 시각, ID 순으로 결정됩니다. rollout 비율을 넓히는 동안 동일 사용자가 같은 bucket을 유지하도록 식별자를 안정적으로 유지하세요.

[설치와 Prisma 7 요구사항](/packages/feature-flag/installation) · [Rollout](/packages/feature-flag/rollout) · [Override](/packages/feature-flag/tenant-overrides)

## 설치부터 첫 성공까지

[설치 가이드](/packages/feature-flag/installation)는 패키지 설치 → Prisma 모델·SQL 제약조건 → 마이그레이션·클라이언트 생성 → 모듈 등록 → 플래그 생성 → HTTP 200 확인을 연결합니다. 필수 peer dependencies는 설치해야 하며, 별도 외부 기능 플래그 서비스는 필요하지 않습니다.

## 0.5.0과 미출시 수정의 경계

배포된 npm 0.5.0은 서비스 평가 과정에서 명시적 `targetingKey`를 전달하지 않습니다. 비율 배포에는 안정적인 `userId` 또는 `tenantId`를 사용하세요. typed client의 registry `bucketBy`와 `evaluateAll()`의 모듈 registry `bucketBy`도 일관되게 적용되지 않습니다. 해당 수정과 `repository` / `tenantContextProvider` 직접 등록 옵션은 **미출시 소스 변경**입니다. 저장소 main의 예제를 설치된 0.5.0에서 바로 쓸 수 있다고 가정하지 마세요.

`enabled: false`는 최종 기본값이므로 활성 비율 배포나 허용 override를 강제로 끄지 않습니다. `percentage: 0`과 함께 설정하고 허용 override도 정리하거나 플래그를 보관해야 합니다. Redis 무효화는 최선 노력 방식이며 즉시 일관성을 보장하지 않습니다. 30초 TTL은 기본값입니다.

[AI 에이전트 사용 가이드와 버전별 제약](/packages/feature-flag/agent-guide) · [캐시](/packages/feature-flag/cache-adapters) · [배포 버전 API](/api/feature-flag/)
