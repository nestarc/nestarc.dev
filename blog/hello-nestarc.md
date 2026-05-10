---
title: Introducing nestarc
date: 2026-04-05
description: Production-ready NestJS modules for SaaS backends — why we built them and what's inside.
author: nestarc
---

# Introducing nestarc

We're excited to introduce **nestarc** — a collection of production-ready NestJS modules designed specifically for SaaS backends.

## Why nestarc?

Building a multi-tenant SaaS application with NestJS requires solving the same set of cross-cutting concerns every time:

- **Tenant isolation** — ensuring data doesn't leak between tenants
- **Audit logging** — tracking who changed what and when
- **Feature flags** — rolling out features gradually
- **Soft deletes** — safely removing data without losing it
- **Pagination** — handling large datasets efficiently
- **Response standardization** — consistent API contracts

Each of these is well-understood, but implementing them correctly takes significant effort. nestarc packages these solutions into composable, well-tested modules that work together.

## The Stack

All nestarc packages share a common foundation:

- **NestJS** 10/11 for the application framework
- **Prisma** 5/6 for type-safe database access
- **PostgreSQL** for the database layer
- **TypeScript** end-to-end

Packages compose via Prisma Client Extensions, so you can combine `@nestarc/tenancy`, `@nestarc/soft-delete`, and `@nestarc/audit-log` in a single Prisma client chain.

## What's Available

| Package | Version | Description |
|---------|---------|-------------|
| `@nestarc/tenancy` | 0.8.0 | PostgreSQL RLS + Prisma multi-tenancy |
| `@nestarc/safe-response` | 0.13.1 | API response wrapper with Swagger |
| `@nestarc/audit-log` | 0.1.0 | Automatic CUD change tracking |
| `@nestarc/feature-flag` | 0.2.0 | DB-based feature flags |
| `@nestarc/soft-delete` | 0.2.0 | Prisma soft-delete extension |
| `@nestarc/pagination` | 0.1.0 | Cursor + offset pagination |
| `@nestarc/idempotency` | 0.1.3 | IETF-style idempotency with response replay |
| `@nestarc/outbox` | 0.1.0 | Transactional outbox for reliable domain events |
| `@nestarc/webhook` | 0.2.0 | Outbound webhook delivery with signing and retry |
| `@nestarc/api-keys` | 0.1.0 | Tenant-scoped API keys with scoped guards |
| `@nestarc/data-subject` | 0.1.0 | GDPR/CCPA export and erase workflows |
| `@nestarc/jobs` | 0.1.0 | Tenant-aware background jobs |

## Get Started

- [Getting Started](/getting-started) — set up your first multi-tenant API in 5 minutes
- [Example: SaaS API](/guide/example-saas-api) — 7 core packages in one project
- [Adoption Roadmap](/guide/adoption-roadmap) — recommended adoption path for first-time users
- [GitHub](https://github.com/nestarc) — all packages are open source (MIT)
