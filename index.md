---
description: "nestarc — production-ready NestJS modules for SaaS backends. Multi-tenancy, audit logs, feature flags, soft-delete, and pagination built on Prisma & PostgreSQL."
layout: home

hero:
  name: nestarc
  text: Production-ready NestJS modules for SaaS backends
  tagline: Multi-tenancy, audit logs, feature flags, and more — built on Prisma & PostgreSQL
  actions:
    - theme: brand
      text: Get Started
      link: /getting-started
    - theme: alt
      text: View on GitHub
      link: https://github.com/nestarc

features:
  - title: tenancy
    details: PostgreSQL RLS + Prisma multi-tenancy. Row-level isolation out of the box.
    link: /packages/tenancy/
    linkText: v0.8.0
  - title: safe-response
    details: API response wrapper with Swagger integration, pagination, and i18n support.
    link: /packages/safe-response/
    linkText: v0.13.1
  - title: audit-log
    details: Prisma CUD auto-tracking with before/after diff. Know who changed what.
    link: /packages/audit-log/
    linkText: v0.1.0
  - title: feature-flag
    details: DB-based feature flags with tenant and user-level overrides.
    link: /packages/feature-flag/
    linkText: v0.1.0
  - title: soft-delete
    details: Prisma soft-delete extension with cascade delete and restore support.
    link: /packages/soft-delete/
    linkText: v0.2.0
  - title: pagination
    details: Cursor + offset pagination with 12 filter operators. Works with Swagger.
    link: /packages/pagination/
    linkText: v0.1.0
---
