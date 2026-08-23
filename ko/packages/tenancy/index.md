---
title: NestJS 멀티테넌시와 PostgreSQL RLS
description: "@nestarc/tenancy 0.15.x에서 Prisma extension, PostgreSQL RLS, live doctor와 비HTTP 컨텍스트 보호를 구성할 때 필요한 경계를 확인하세요."
---

# NestJS 멀티테넌시와 PostgreSQL RLS

`@nestarc/tenancy` 0.15.x는 요청에서 테넌트 ID를 추출하고, Prisma Client Extension이 트랜잭션 내부에서 PostgreSQL 세션 컨텍스트를 설정하도록 돕습니다. 실제 격리는 데이터베이스의 RLS 정책이 수행합니다. 0.15에는 운영 역할과 적용된 RLS를 검사하는 `doctor`, Prisma 6/7 PgBouncer transaction-mode 검증, 비HTTP missing-context 정책이 추가되었습니다.

## 반드시 확인할 점

- 기본 테넌트 ID 검증은 UUID 형식입니다. 다른 형식이나 존재 확인이 필요하면 `validateTenantId`를 설정합니다.
- `TenancyModule.forRoot()` 등록만으로 Prisma 쿼리가 격리되지는 않습니다. `createPrismaTenancyExtension()`으로 만든 확장 클라이언트를 사용해야 합니다.
- 테이블 소유자 우회를 막아야 한다면 `FORCE ROW LEVEL SECURITY`와 운영 DB 역할을 함께 검토합니다.
- 배치와 큐 작업은 HTTP 요청 밖에서 실행되므로 `TenancyContext.run()`으로 컨텍스트를 명시하고, `missingContext: { policy: 'warn' | 'throw' }`로 누락을 관찰하거나 차단합니다.
- 배포 전후 `npx @nestarc/tenancy check`로 생성 SQL을 검사하고, 실제 애플리케이션 DB 역할로 `npx @nestarc/tenancy doctor`를 실행합니다.
- interactive transaction은 Prisma 내부 API에 의존하는 투명 모드 대신 `tenancyTransaction()`을 사용합니다. 0.15는 `maxWait`, `timeout`, isolation level을 전달합니다.

[전체 설치 문서](/packages/tenancy/installation) · [CLI와 live doctor](/packages/tenancy/cli) · [비HTTP 리소스 보호](/packages/tenancy/non-http-resources) · [PostgreSQL RLS 공식 문서](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
