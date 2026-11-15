import 'reflect-metadata';
import { Inject, Injectable, Module, OnApplicationShutdown } from '@nestjs/common';
import { APP_GUARD, NestFactory } from '@nestjs/core';
import { ApiKeysModule, PrismaApiKeyStorage, type PrismaLike } from '@nestarc/api-keys';
import { DemoAdminGuard } from './auth';
import { requiredEnv } from './config';
import { KeysController, ReportsController, ROTATION_GRACE_MS } from './controllers';
import { createDatabase, DATABASE } from './database';
import { PrismaClient } from './generated/prisma/client';

@Injectable()
class DatabaseLifecycle implements OnApplicationShutdown {
  constructor(@Inject(DATABASE) private readonly prisma: PrismaClient) {}
  async onApplicationShutdown() { await this.prisma.$disconnect(); }
}

export async function createApp(rotationGraceMs = 10_000) {
  const prisma = createDatabase();

  @Module({
    imports: [ApiKeysModule.forRoot({
      namespace: 'reports',
      peppers: { 1: requiredEnv('API_KEY_PEPPER') },
      // 0.4.0's structural interface does not model generated Prisma overloads.
      // Keep this bridge at the storage boundary; smoke exercises its real SQL,
      // tenant-bound mutations, and interactive rotation transaction.
      storage: new PrismaApiKeyStorage(prisma as unknown as PrismaLike),
      ttlPolicy: { defaultExpiresInMs: 30 * 24 * 60 * 60 * 1000, allowNeverExpires: false },
    })],
    controllers: [KeysController, ReportsController],
    providers: [
      { provide: DATABASE, useValue: prisma },
      { provide: ROTATION_GRACE_MS, useValue: rotationGraceMs },
      { provide: APP_GUARD, useClass: DemoAdminGuard },
      DatabaseLifecycle,
    ],
  })
  class AppModule {}

  const app = await NestFactory.create(AppModule, { logger: false, abortOnError: false });
  try {
    await prisma.$connect();
    await app.init();
    return { app, prisma };
  } catch (error) {
    await app.close();
    await prisma.$disconnect();
    throw error;
  }
}
