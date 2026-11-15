import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './generated/prisma/client';
import { requiredEnv } from './config';

export function createDatabase(): PrismaClient {
  const url = new URL(requiredEnv('DATABASE_URL'));
  const schema = url.searchParams.get('schema') ?? 'public';
  url.searchParams.delete('schema');
  return new PrismaClient({
    adapter: new PrismaPg({ connectionString: url.toString() }, { schema }),
  });
}

export const DATABASE = Symbol('DATABASE');
