---
description: "nestarc — SaaS 백엔드를 위한 프로덕션급 NestJS 모듈. 멀티테넌시, 감사 로그, 피처 플래그, 소프트 딜리트, 페이지네이션을 Prisma와 PostgreSQL 기반으로 제공합니다."
layout: home

hero:
  name: nestarc
  text: SaaS 백엔드를 위한 프로덕션급 NestJS 모듈
  tagline: 멀티테넌시, 감사 로그, 피처 플래그 등 — Prisma & PostgreSQL 기반
  actions:
    - theme: brand
      text: 시작하기
      link: /ko/getting-started
    - theme: alt
      text: GitHub에서 보기
      link: https://github.com/nestarc

features:
  - title: tenancy
    details: PostgreSQL RLS + Prisma 멀티테넌시. 행 수준 격리를 즉시 적용할 수 있습니다.
    link: /packages/tenancy/
    linkText: v0.8.0
  - title: safe-response
    details: Swagger 통합, 페이지네이션, i18n을 지원하는 API 응답 래퍼.
    link: /packages/safe-response/
    linkText: v0.13.1
  - title: audit-log
    details: Prisma CUD 자동 추적 — before/after diff로 누가 무엇을 변경했는지 기록합니다.
    link: /packages/audit-log/
    linkText: v0.1.0
  - title: feature-flag
    details: 테넌트 및 사용자 수준 오버라이드를 지원하는 DB 기반 피처 플래그.
    link: /packages/feature-flag/
    linkText: v0.1.0
  - title: soft-delete
    details: 캐스케이드 삭제 및 복원을 지원하는 Prisma 소프트 딜리트 확장.
    link: /packages/soft-delete/
    linkText: v0.2.0
  - title: pagination
    details: 12가지 필터 연산자를 지원하는 커서 + 오프셋 페이지네이션. Swagger와 함께 동작합니다.
    link: /packages/pagination/
    linkText: v0.1.0
---
