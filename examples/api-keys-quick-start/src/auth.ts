import { timingSafeEqual } from 'node:crypto';
import {
  applyDecorators, CanActivate, ExecutionContext, Injectable,
  SetMetadata, UnauthorizedException, UseGuards,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ApiKeysGuard, RequireEnvironment } from '@nestarc/api-keys';
import { demoAdmins } from './config';

const CUSTOMER_API = Symbol('CUSTOMER_API');

// The skip marker and key guard travel together: this is not a public route.
export function CustomerApi() {
  return applyDecorators(
    SetMetadata(CUSTOMER_API, true),
    UseGuards(ApiKeysGuard),
    RequireEnvironment('live'),
  );
}

export interface AdminRequest {
  headers: { authorization?: string };
  admin: { tenantId: string; userId: string };
}

@Injectable()
export class DemoAdminGuard implements CanActivate {
  private readonly admins = demoAdmins();

  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    if (this.reflector.getAllAndOverride(CUSTOMER_API, [
      context.getHandler(), context.getClass(),
    ])) return true;

    const request = context.switchToHttp().getRequest<AdminRequest>();
    const authorization = request.headers.authorization;
    if (!authorization?.startsWith('Bearer ')) throw new UnauthorizedException();
    const supplied = Buffer.from(authorization.slice(7));
    const admin = this.admins.find(({ token }) => {
      const expected = Buffer.from(token);
      return supplied.length === expected.length && timingSafeEqual(supplied, expected);
    });
    if (!admin) throw new UnauthorizedException();
    request.admin = { tenantId: admin.tenantId, userId: admin.userId };
    return true;
  }
}
