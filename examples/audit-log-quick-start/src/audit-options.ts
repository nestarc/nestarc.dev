import 'dotenv/config';
import { AsyncLocalStorage } from 'node:async_hooks';
import { defineAuditConfig } from '@nestarc/audit-log';
import { Prisma } from './generated/prisma/client';

export const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('Set DATABASE_URL before starting the example.');
export const databaseSchema = new URL(connectionString).searchParams.get('schema') ?? 'public';
export const tenantScope = new AsyncLocalStorage<{ tenantId: string }>();

// One policy supplies the Nest module, automatic extension, and storage setup.
export const auditConfig = defineAuditConfig({
  shared: {
    prismaModule: { Prisma },
    tableName: `${databaseSchema}.audit_logs`,
    actorRequired: true,
    tenantRequired: true,
    tenantResolver: () => tenantScope.getStore()?.tenantId ?? null,
    sensitiveFields: ['password'],
  },
  module: {
    actorExtractionStage: 'interceptor',
    actorExtractor: req => ({
      id: req.user?.id ?? null,
      type: req.user ? 'user' : 'system',
      ip: req.ip,
    }),
  },
  extension: {
    consistency: 'atomic-required',
    trackedModels: ['User'],
    databaseMapping: { User: { tableName: 'users', schema: databaseSchema } },
  },
});
