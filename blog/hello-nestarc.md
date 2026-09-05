---
title: Introducing nestarc
date: 2026-04-05
description: Maintained NestJS modules with explicit Supported and Preview status — why we built them and what's inside.
author: nestarc
reviewed: 2026-09-05
versionScope: "NestJS 10/11, package-specific NestJS 12 support, and @nestarc package releases current on September 5, 2026"
---

# Introducing nestarc

We're excited to introduce **nestarc** — a collection of maintained NestJS modules for SaaS backends. Each package has an explicit **Supported** or **Preview** status so teams can choose an adoption level that matches their risk tolerance.

## Why nestarc?

Building a multi-tenant SaaS application with NestJS requires solving the same set of cross-cutting concerns every time:

- **Tenant isolation** — ensuring data doesn't leak between tenants
- **Audit logging** — tracking who changed what and when
- **Feature flags** — rolling out features gradually
- **Access control** — keeping tenant and resource permissions consistent
- **Soft deletes** — safely removing data without losing it
- **Pagination** — handling large datasets efficiently
- **Response standardization** — consistent API contracts

Each of these is well-understood, but implementing them correctly takes significant effort. nestarc packages these solutions into composable, well-tested modules that work together.

## The Stack

All nestarc packages share NestJS and TypeScript conventions. Data-oriented packages may additionally use Prisma and PostgreSQL:

- **NestJS** 10/11 for the application framework; audit-log 0.5 supports 12.0.1+, while API Keys 0.4, RBAC 0.2.2, and Outbox 0.3 also accept NestJS 12
- **Prisma** 5/6/7, depending on the data package, for type-safe database access
- **PostgreSQL** where a package relies on database features such as RLS or an outbox
- **TypeScript** end-to-end

The Prisma-based packages compose via Prisma Client Extensions. For the supported atomic lifecycle
bridge, apply `@nestarc/tenancy`, `@nestarc/audit-log`, then `@nestarc/soft-delete` in that fixed order.
Packages such as `@nestarc/safe-response` do not require Prisma or PostgreSQL.

## What's Available

| Package | Version | Description |
|---------|---------|-------------|
| `@nestarc/tenancy` | 0.16.0 | PostgreSQL RLS + Prisma multi-tenancy |
| `@nestarc/safe-response` | 0.15.0 | API response wrapper with Swagger |
| `@nestarc/audit-log` | 0.5.0 | Supported `atomic-required` CUD tracking through `withAuditTransaction()`, streaming export, and durable delivery |
| `@nestarc/feature-flag` | 0.5.0 | DB-based feature flags |
| `@nestarc/soft-delete` | 0.7.2 | Prisma soft-delete with optional atomic audit lifecycles, relation filters, and bulk restore |
| `@nestarc/pagination` | 0.3.0 | Cursor + offset pagination |
| `@nestarc/idempotency` | 0.4.0 | IETF draft-07 idempotency with response/header replay |
| `@nestarc/outbox` | 0.3.0 | Transactional outbox for reliable domain events |
| `@nestarc/webhook` | 0.13.1 | Outbound webhook delivery with signing and retry |
| `@nestarc/api-keys` | 0.4.0 | Tenant-scoped API keys with scoped guards |
| `@nestarc/rbac` | 0.2.2 | Tenant-aware roles, permissions, and guards |
| `@nestarc/data-subject` | 0.2.0 | GDPR/CCPA export and erase workflows |
| `@nestarc/jobs` | 0.4.0 | Tenant-aware jobs with in-memory fairness, durable BullMQ retry/dedupe, and outbox publishing |

`@nestarc/mcp-guard` is also published under the @nestarc scope, but it lives under Labs tooling rather than the NestJS SaaS package lineup.

## Get Started

- [Getting Started](/getting-started) — set up your first multi-tenant API in 5 minutes
- [Example: SaaS API](/guide/example-saas-api) — 7 core packages in one project
- [Adoption Roadmap](/guide/adoption-roadmap) — recommended adoption path for first-time users
- [GitHub](https://github.com/nestarc) — all packages are open source (MIT)
