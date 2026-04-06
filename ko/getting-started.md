---
description: "@nestarc/tenancy, Prisma, PostgreSQL RLS를 사용해 5분 만에 멀티테넌트 NestJS API를 구축합니다."
---

# 시작하기

5분 만에 첫 번째 멀티테넌트 API를 실행해 보세요.

## 사전 요구사항

| 도구 | 버전 |
|------|------|
| Node.js | 18+ |
| NestJS | 10 또는 11 |
| Prisma | 5 또는 6 |
| PostgreSQL | 14+ |

## 1단계: 설치

```bash
npm install @nestarc/tenancy
```

## 2단계: 테이블에 RLS 활성화

```sql
ALTER TABLE users ADD COLUMN tenant_id TEXT NOT NULL;

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE users FORCE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON users
  USING (tenant_id = current_setting('app.current_tenant', true)::text);
```

## 3단계: Prisma 스키마 업데이트

```prisma
model User {
  id        Int    @id @default(autoincrement())
  name      String
  tenantId  String @map("tenant_id")

  @@map("users")
}
```

## 4단계: NestJS 모듈 등록

```typescript
import { TenancyModule } from '@nestarc/tenancy';

@Module({
  imports: [
    TenancyModule.forRoot({
      tenantExtractor: 'X-Tenant-Id',
    }),
  ],
})
export class AppModule {}
```

## 5단계: 확인

```bash
# 테넌트 A로 요청
curl -H "X-Tenant-Id: tenant-a" http://localhost:3000/users

# 테넌트 B로 요청 — 테넌트 A의 데이터는 보이지 않습니다
curl -H "X-Tenant-Id: tenant-b" http://localhost:3000/users
```

PostgreSQL RLS가 모든 쿼리에 자동으로 테넌트 격리를 적용합니다.

## 다음 단계

- [테넌트 추출기](/packages/tenancy/extractors) — 헤더, 서브도메인, JWT, 커스텀 전략
- [라이프사이클 훅](/packages/tenancy/lifecycle-hooks) — 테넌트 해석 이벤트 처리
- [멀티테넌트 SaaS 처음부터 구축하기](/guide/multi-tenant-saas) — 전체 튜토리얼
