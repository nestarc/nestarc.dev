---
description: "Upgrade @nestarc/soft-delete to 0.6 with first-class Prisma 7 support and explicit DMMF configuration."
---

# Upgrade to 0.6

`@nestarc/soft-delete` 0.6.0 adds Prisma 7 to the published peer range and makes it the primary generated-client and PostgreSQL E2E target. Prisma 5 and 6 remain supported.

## What Changed

- Prisma 7 setup now uses Prisma Config, the `prisma-client` generator, explicit generated output, and a database driver adapter.
- Shared extension creation imports from `@prisma/client/extension`, so the package no longer depends on a generated `@prisma/client` root export.
- Cascade and relation filters require explicit `dmmf` metadata instead of reading generated-client runtime metadata.
- The minimum Node.js engine range follows the Prisma 7 toolchain: `^20.19`, `^22.12`, or `>=24`.

## Upgrade Checklist

1. Upgrade to `@nestarc/soft-delete@0.6.0`.
2. If upgrading Prisma, complete the shared [Prisma 7 setup](/guide/prisma-7).
3. If cascade or relation filters are enabled, pin `@prisma/internals` to the Prisma version and pass explicit `dmmf` to the extension and module.
4. Regenerate Prisma Client and run tests that cover delete, nested relation reads, cascade, restore, and purge.

No package-owned database migration is required. Your application still owns `deletedAt`, `deletedBy`, and active-row unique indexes.

See [Installation](./installation) for the complete setup and the [v0.6.0 GitHub release](https://github.com/nestarc/nestjs-soft-delete/releases/tag/v0.6.0) for authoritative release notes.
