import {
  BadRequestException, Body, Controller, Delete, Get, Header, HttpCode,
  Inject, NotFoundException, Param, Post, Req,
} from '@nestjs/common';
import {
  ApiKeyOperationError, ApiKeysService, CurrentApiKey, RequireScope,
  type ApiKeyContext,
} from '@nestarc/api-keys';
import { AdminRequest, CustomerApi } from './auth';
import { DATABASE } from './database';
import { PrismaClient } from './generated/prisma/client';

export const ROTATION_GRACE_MS = Symbol('ROTATION_GRACE_MS');

// Both a missing ID and another tenant's ID produce the same response.
async function tenantKeyOperation<T>(operation: () => Promise<T>): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (error instanceof ApiKeyOperationError && error.code === 'api_key_record_not_found') {
      throw new NotFoundException({ code: error.code });
    }
    if (error instanceof ApiKeyOperationError && error.code === 'api_key_not_rotatable') {
      throw new BadRequestException({ code: error.code });
    }
    throw error;
  }
}

@Controller('admin/api-keys')
export class KeysController {
  constructor(
    private readonly keys: ApiKeysService,
    @Inject(ROTATION_GRACE_MS) private readonly gracePeriodMs: number,
  ) {}

  @Post()
  @Header('Cache-Control', 'no-store')
  create(@Req() request: AdminRequest) {
    return this.keys.create({
      tenantId: request.admin.tenantId,
      createdBy: request.admin.userId,
      name: 'Customer reports integration',
      environment: 'live',
      scopes: [{ resource: 'reports', level: 'read' }],
    });
  }

  @Post(':id/rotate')
  @Header('Cache-Control', 'no-store')
  rotate(@Req() request: AdminRequest, @Param('id') id: string) {
    return tenantKeyOperation(() => this.keys.rotateForTenant(request.admin.tenantId, id, {
      gracePeriodMs: this.gracePeriodMs,
      createdBy: request.admin.userId,
    }));
  }

  @Delete(':id')
  @HttpCode(204)
  async revoke(@Req() request: AdminRequest, @Param('id') id: string) {
    await tenantKeyOperation(() => this.keys.revokeForTenant(request.admin.tenantId, id));
  }
}

@Controller('reports')
@CustomerApi()
export class ReportsController {
  constructor(@Inject(DATABASE) private readonly prisma: PrismaClient) {}

  @Get()
  @RequireScope('reports', 'read')
  list(@CurrentApiKey() key: ApiKeyContext) {
    return this.prisma.report.findMany({
      where: { tenantId: key.tenantId },
      orderBy: { id: 'asc' },
    });
  }

  @Get(':id')
  @RequireScope('reports', 'read')
  async get(@CurrentApiKey() key: ApiKeyContext, @Param('id') id: string) {
    const report = await this.prisma.report.findFirst({ where: { id, tenantId: key.tenantId } });
    if (!report) throw new NotFoundException();
    return report;
  }

  @Post()
  @RequireScope('reports', 'write')
  create(@CurrentApiKey() key: ApiKeyContext, @Body() body: unknown) {
    const title = body && typeof body === 'object' && 'title' in body ? body.title : undefined;
    if (typeof title !== 'string' || !title.trim() || title.length > 200) {
      throw new BadRequestException('title must contain 1–200 characters');
    }
    return this.prisma.report.create({ data: { tenantId: key.tenantId, title: title.trim() } });
  }
}
