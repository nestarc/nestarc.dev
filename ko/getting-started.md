---
description: "@nestarc/tenancy, Prisma, PostgreSQL RLS를 사용해 5분 만에 멀티테넌트 NestJS API를 구축합니다."
---

# 시작하기

5분 만에 첫 번째 멀티테넌트 API를 실행해 보세요.

어떤 모듈부터 도입할지 고민된다면 [패키지 비교](/packages/) 또는 [도입 로드맵](/guide/adoption-roadmap)을 먼저 확인하세요.

## 사전 요구사항

| 도구 | 버전 |
|------|------|
| Node.js | `^22.13.0` 또는 `^24.0.0` |
| NestJS | 10 또는 11 |
| Prisma | 7 권장; tenancy는 6 지원 |
| PostgreSQL | 14+ |

::: tip 필요한 의존성 구성이 이미 끝났나요?
`@nestarc/tenancy`, Prisma 7 PostgreSQL adapter, `prisma.config.ts`, generated client까지 모두 구성된 경우에만 [2단계](#enable-rls)로 이동하세요.
:::

## 1단계: 설치

```bash
npm install @nestarc/tenancy @prisma/client @prisma/adapter-pg pg dotenv
npm install --save-dev prisma
```

이 빠른 시작은 [Prisma 7 설정](/guide/prisma-7)에 따라 generated client와 `prisma.config.ts`를 구성한 환경을 기준으로 합니다.

## 2단계: 테이블에 RLS 활성화 {#enable-rls}

이 예제는 아래 모델과 동일하지만 `tenant_id`만 없고 아직 데이터가 없는 `users` 테이블을 가정합니다. 스키마 소유자 권한으로 tenant 열, 인덱스, RLS를 추가합니다.

```sql
ALTER TABLE users ADD COLUMN tenant_id TEXT NOT NULL;
CREATE INDEX users_tenant_id_idx ON users (tenant_id);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE users FORCE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON users
  USING (tenant_id = current_setting('app.current_tenant', true)::text);

CREATE POLICY tenant_context_guard_users ON users
  AS RESTRICTIVE
  USING (NULLIF(current_setting('app.current_tenant', true), '') IS NOT NULL)
  WITH CHECK (NULLIF(current_setting('app.current_tenant', true), '') IS NOT NULL);
```

같은 테이블을 Prisma 스키마에 노출한 뒤 클라이언트를 다시 생성합니다.

```prisma
model User {
  id       String @id @default(uuid())
  name     String
  tenantId String @map("tenant_id")

  @@index([tenantId], map: "users_tenant_id_idx")
  @@map("users")
}
```

```bash
npx prisma generate
```

Prisma Migrate를 사용한다면 임시 SQL로 실행하지 말고 열, 인덱스, RLS 구문을 하나의 마이그레이션에 함께 넣으세요.

::: warning 기존 운영 데이터가 있는 경우
`ADD COLUMN ... NOT NULL`은 빈 테이블에서만 바로 성공합니다. 기존 테이블은 nullable 열 추가 → 신뢰할 수 있는 tenant 소유권 데이터로 전체 행 backfill → 매핑 검증 → `NOT NULL` 적용 순서로 마이그레이션하세요. 서로 관련 없는 행을 하나의 임시 tenant에 넣으면 안 됩니다.
:::

::: warning
`ENABLE`과 `FORCE`가 모두 필요합니다. `FORCE`가 없으면 테이블 소유자 역할이 RLS를 우회합니다. 자세한 내용은 [멀티테넌시에서 자주 발생하는 5가지 문제](/blog/nestjs-multi-tenancy-pitfalls)를 참고하세요.
:::

## 3단계: 모듈 등록

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { TenancyModule } from '@nestarc/tenancy';
import { PrismaService } from './prisma.service';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';

@Module({
  imports: [
    TenancyModule.forRoot({
      tenantExtractor: 'X-Tenant-Id',
    }),
  ],
  controllers: [UsersController],
  providers: [PrismaService, UsersService],
})
export class AppModule {}
```

::: warning 운영 환경에서는 tenant 선택을 인증하세요
이 로컬 예제는 간결함을 위해 원본 `X-Tenant-Id` 헤더를 신뢰하지만, 헤더만으로 호출자의 tenant 접근 권한이 증명되지는 않습니다. 운영 환경에서는 인증된 JWT claim에서 tenant를 가져오거나 [헤더 값을 JWT와 교차 검증](/packages/tenancy/lifecycle-hooks#tenant-id-forgery-prevention)하세요.
:::

## 4단계: Prisma 확장

```typescript
// prisma.service.ts
import 'dotenv/config';
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
      createPrismaTenancyExtension(tenancyService, {
        autoInjectTenantId: true,
        // Prisma 필드명을 사용합니다. SQL 열 매핑은 @map("tenant_id")이 처리합니다.
        tenantIdField: 'tenantId',
      }),
    );
  }

  async onModuleInit() {
    await this.client.$connect();
  }
}
```

마이그레이션과 RLS 설정은 스키마 소유자 자격 증명으로 실행하되, 애플리케이션은 별도의 non-owner, non-superuser 역할로 연결합니다. `CREATE ROLE`에는 PostgreSQL `CREATEROLE` 또는 superuser 권한이 필요하므로 데이터베이스 관리자나 프로비저닝 절차에서 역할을 만들고, 마이그레이션 소유자는 그 뒤 GRANT를 적용하세요.

```sql
CREATE ROLE app_user LOGIN PASSWORD 'replace-with-a-secret';
GRANT USAGE ON SCHEMA public TO app_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE users TO app_user;
```

런타임 `DATABASE_URL`은 이 역할을 사용하도록 설정하세요(예: `postgresql://app_user:...@localhost:5432/app`). 실행 중인 애플리케이션에 스키마 소유자 자격 증명을 넣지 마세요.

자격 증명을 분리하려면 `prisma.config.ts`는 `env('MIGRATION_DATABASE_URL')`을 사용하고 위 adapter는 계속 `DATABASE_URL`을 사용하게 하세요. 전자는 스키마 마이그레이션용 소유자 연결이고, 후자는 제한된 런타임 연결입니다.

## 5단계: API 엔드포인트 생성

```typescript
// users/users.service.ts
import { Injectable } from '@nestjs/common';
import { TenancyService } from '@nestarc/tenancy';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tenancy: TenancyService,
  ) {}

  findAll() {
    // RLS가 테넌트를 자동 필터링하므로 WHERE 절이 필요하지 않습니다
    return this.prisma.client.user.findMany();
  }

  create(name: string) {
    const tenantId = this.tenancy.getCurrentTenantOrThrow();
    return this.prisma.client.user.create({ data: { name, tenantId } });
  }
}
```

Prisma가 생성한 `UserCreateInput`에서는 `tenantId`가 여전히 필수이므로 요청 본문에서 받지 않고 해석된 tenant context 값을 전달합니다. 확장은 런타임에 같은 필드를 다시 덮어써 본문을 통한 위조를 막고 bulk write 경로도 보호합니다. 운영 환경에서는 앞서 설명한 대로 이 context를 인증하거나 교차 검증하세요.

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
# tenant A 사용자 생성
curl -X POST http://localhost:3000/users \
  -H "X-Tenant-Id: 550e8400-e29b-41d4-a716-446655440000" \
  -H "Content-Type: application/json" \
  -d '{"name": "Alice"}'

# tenant B 사용자 생성
curl -X POST http://localhost:3000/users \
  -H "X-Tenant-Id: 123e4567-e89b-42d3-a456-426614174000" \
  -H "Content-Type: application/json" \
  -d '{"name": "Bob"}'

# tenant A에서는 Alice만 조회됩니다
curl http://localhost:3000/users \
  -H "X-Tenant-Id: 550e8400-e29b-41d4-a716-446655440000"
# => [{"id":"<uuid>","name":"Alice","tenantId":"550e8400-e29b-41d4-a716-446655440000"}]

# tenant B에서는 Bob만 조회됩니다
curl http://localhost:3000/users \
  -H "X-Tenant-Id: 123e4567-e89b-42d3-a456-426614174000"
# => [{"id":"<uuid>","name":"Bob","tenantId":"123e4567-e89b-42d3-a456-426614174000"}]
```

RLS 정책과 애플리케이션 역할을 위와 같이 구성하면 PostgreSQL이 애플리케이션의 수동 `WHERE` 절 없이 현재 테넌트로 쿼리를 필터링합니다.

## 다음 단계

- [테넌트 추출기](/packages/tenancy/extractors) — 헤더, 서브도메인, JWT, 커스텀 전략
- [라이프사이클 훅](/packages/tenancy/lifecycle-hooks) — 테넌트 해석 이벤트 처리
- [RBAC](/packages/rbac/) — 테넌트 인식 역할, 권한, 리소스 범위 guard
- [패키지 비교](/packages/) — 모든 SaaS 패키지의 상태, 버전, 도입 목적 비교
- [멀티테넌트 SaaS 처음부터 구축하기](/guide/multi-tenant-saas) — 전체 튜토리얼

`@nestarc/mcp-guard`는 같은 npm 스코프로 배포되지만 NestJS SaaS 모듈과 분리된 도구입니다. MCP 서버와 클라이언트 설정 파일을 정적으로 검사하려면 [mcp-guard](/tools/mcp-guard/)를 참고하세요.
