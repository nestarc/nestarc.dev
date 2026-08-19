---
title: NestJS 데이터베이스 기반 기능 플래그
description: "@nestarc/feature-flag 0.5.x의 속성 override, percentage rollout, 캐시와 Prisma 7 호환 경계를 한국어로 확인하세요."
---

# NestJS 데이터베이스 기반 기능 플래그

`@nestarc/feature-flag` 0.5.x는 Prisma 7과 PostgreSQL을 사용하는 데이터베이스 기반 기능 플래그입니다. 평가 결과는 캐시할 수 있고, 특정 테넌트·사용자·환경을 고정 컬럼이 아닌 `attributes` 객체로 타기팅합니다.

## 평가 순서

1. 보관된(archived) 플래그는 `false`
2. 컨텍스트와 모든 속성이 일치하는 최적 override
3. 안정적인 targeting key를 사용한 percentage rollout
4. 전역 `enabled` 기본값

여러 override가 일치하면 속성 수, `priority`, 생성 시각, ID 순으로 결정됩니다. rollout 비율을 넓히는 동안 동일 사용자가 같은 bucket을 유지하도록 식별자를 안정적으로 유지하세요.

[설치와 Prisma 7 요구사항](/packages/feature-flag/installation) · [Rollout](/packages/feature-flag/rollout) · [Override](/packages/feature-flag/tenant-overrides)
