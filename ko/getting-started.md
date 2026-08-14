---
description: "@nestarc/tenancy, Prisma, PostgreSQL RLS를 사용해 5분 만에 멀티테넌트 NestJS API를 구축합니다."
---

# 시작하기

5분 만에 첫 번째 멀티테넌트 API를 실행해 보세요.

어떤 모듈부터 도입할지 고민된다면 [패키지 비교](/packages/) 또는 [도입 로드맵](/guide/adoption-roadmap)을 먼저 확인하세요.

## 사전 요구사항

| 도구 | 버전 |
|------|------|
| Node.js | 20.19+ |
| NestJS | 10 또는 11 |
| Prisma | 7 권장; tenancy는 6 지원 |
| PostgreSQL | 14+ |

::: tip 이미 NestJS + Prisma 프로젝트가 있나요?
[2단계](#enable-rls)로 이동하세요.
:::

## 1단계: 설치

```bash
npm install @nestarc/tenancy @prisma/client @prisma/adapter-pg pg dotenv
npm install --save-dev prisma
```

이 빠른 시작은 [Prisma 7 설정](/guide/prisma-7)에 따라 generated client와 `prisma.config.ts`를 구성한 환경을 기준으로 합니다.

## 2단계: 테이블에 RLS 활성화 {#enable-rls}

```sql
ALTER TABLE users ADD COLUMN tenant_id TEXT NOT NULL;

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE users FORCE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON users
  USING (tenant_id = current_setting('app.current_tenant', true)::text);
```

::: warning
`ENABLE`과 `FORCE`가 모두 필요합니다. `FORCE`가 없으면 테이블 소유자 역할이 RLS를 우회합니다. 자세한 내용은 [멀티테넌시에서 자주 발생하는 5가지 문제](/blog/nestjs-multi-tenancy-pitfalls)를 참고하세요.
:::

## 3단계: 모듈 등록

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { TenancyModule } from '@nestarc/tenancy';
import { PrismaService } from './prisma.service';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    TenancyModule.forRoot({
      tenantExtractor: 'X-Tenant-Id',
    }),
    UsersModule,
  ],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
```

## 4단계: Prisma 확장

```typescript
// prisma.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './generated/prisma/client';
import { TenancyService, createPrismaTenancyExtension } from '@nestarc/tenancy';

@Injectable()
export class PrismaService implements OnModuleInit {
  public readonly client;

  constructor(private readonly tenancyService: TenancyService) {
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL!,
    });
    const basePrisma = new PrismaClient({ adapter });
    this.client = basePrisma.$extends(
      createPrismaTenancyExtension(tenancyService),
    );
  }

  async onModuleInit() {
    await this.client.$connect();
  }
}
```

## 5단계: API 엔드포인트 생성

```typescript
// users/users.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    // RLS가 테넌트를 자동 필터링하므로 WHERE 절이 필요하지 않습니다
    return this.prisma.client.user.findMany();
  }

  create(name: string) {
    // Prisma 확장이 tenant_id를 자동으로 추가합니다
    return this.prisma.client.user.create({ data: { name } });
  }
}
```

```typescript
// users/users.controller.ts
import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Post()
  create(@Body('name') name: string) {
    return this.usersService.create(name);
  }
}
```

## 6단계: 확인

```bash
# tenant-a 사용자 생성
curl -X POST http://localhost:3000/users \
  -H "X-Tenant-Id: tenant-a" \
  -H "Content-Type: application/json" \
  -d '{"name": "Alice"}'

# tenant-b 사용자 생성
curl -X POST http://localhost:3000/users \
  -H "X-Tenant-Id: tenant-b" \
  -H "Content-Type: application/json" \
  -d '{"name": "Bob"}'

# tenant-a에서는 Alice만 조회됩니다
curl http://localhost:3000/users -H "X-Tenant-Id: tenant-a"
# => [{"id": 1, "name": "Alice", "tenantId": "tenant-a"}]

# tenant-b에서는 Bob만 조회됩니다
curl http://localhost:3000/users -H "X-Tenant-Id: tenant-b"
# => [{"id": 2, "name": "Bob", "tenantId": "tenant-b"}]
```

RLS 정책과 애플리케이션 역할을 위와 같이 구성하면 PostgreSQL이 애플리케이션의 수동 `WHERE` 절 없이 현재 테넌트로 쿼리를 필터링합니다.

## 다음 단계

- [테넌트 추출기](/packages/tenancy/extractors) — 헤더, 서브도메인, JWT, 커스텀 전략
- [라이프사이클 훅](/packages/tenancy/lifecycle-hooks) — 테넌트 해석 이벤트 처리
- [RBAC](/packages/rbac/) — 테넌트 인식 역할, 권한, 리소스 범위 guard
- [패키지 비교](/packages/) — 모든 SaaS 패키지의 상태, 버전, 도입 목적 비교
- [멀티테넌트 SaaS 처음부터 구축하기](/guide/multi-tenant-saas) — 전체 튜토리얼

`@nestarc/mcp-guard`는 같은 npm 스코프로 배포되지만 NestJS SaaS 모듈과 분리된 도구입니다. MCP 서버와 클라이언트 설정 파일을 정적으로 검사하려면 [mcp-guard](/tools/mcp-guard/)를 참고하세요.
