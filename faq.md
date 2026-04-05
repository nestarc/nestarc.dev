# FAQ

## General

### nestarc 패키지들은 서로 의존성이 있나요?

없습니다. 모든 패키지는 독립적으로 설치하고 사용할 수 있습니다. 함께 사용하면 Prisma extension chaining으로 조합할 수 있지만, 필수는 아닙니다.

### NestJS 버전 호환성은?

NestJS 10과 11 모두 지원합니다. CI에서 두 버전 모두 테스트합니다.

### Prisma 버전 호환성은?

Prisma 5와 6 모두 지원합니다. Prisma 6은 CI에서 통합 테스트, Prisma 5는 유닛 테스트로 검증합니다.

### Express와 Fastify 모두 지원하나요?

`@nestarc/safe-response`는 Express와 Fastify 모두 지원합니다. 나머지 패키지들은 HTTP 어댑터에 무관하게 동작합니다.

---

## @nestarc/tenancy

### RLS가 동작하지 않는 것 같습니다

가장 흔한 원인:

1. **Superuser로 접속** — PostgreSQL superuser는 RLS를 무시합니다. 전용 `app_user` 역할을 만들어 사용하세요.
2. **FORCE ROW LEVEL SECURITY 미적용** — 테이블 소유자도 RLS를 따르려면 `ALTER TABLE ... FORCE ROW LEVEL SECURITY`가 필요합니다.
3. **tenant_id 누락** — 테이블에 `tenant_id` 컬럼이 없거나, RLS 정책의 `current_setting` 키가 extension 설정과 다릅니다.

`npx @nestarc/tenancy check`로 Prisma 스키마와 SQL 간 불일치를 감지할 수 있습니다.

### set_config이 interactive transaction에서 작동하지 않습니다

기본적으로 Prisma extension은 batch transaction을 사용하며, interactive transaction(`$transaction(async (tx) => ...)`) 내부에서는 `set_config`이 전파되지 않습니다.

두 가지 해결 방법:
1. `tenancyTransaction()` 헬퍼 사용 (권장, 모든 Prisma 버전 호환)
2. `interactiveTransactionSupport: true` 옵션 활성화 (Prisma 내부 API 의존)

자세한 내용은 [Installation](/packages/tenancy/installation#interactive-transactions)을 참고하세요.

### 특정 모델에서 RLS를 건너뛰고 싶습니다

`sharedModels` 옵션을 사용하세요:

```typescript
createPrismaTenancyExtension(tenancyService, {
  sharedModels: ['Country', 'Currency'],
})
```

shared model에 대한 쿼리는 `set_config`을 호출하지 않으며, `autoInjectTenantId`도 적용되지 않습니다.

### 테넌트 없이 쿼리하고 싶습니다

`withoutTenant()`를 사용하면 tenant context를 명시적으로 해제합니다. 단, RLS가 활성화된 테이블에서는 0개 행이 반환됩니다. 전체 테넌트 데이터를 조회하려면 RLS를 우회하는 별도의 admin 연결이 필요합니다.

---

## @nestarc/safe-response

### 특정 라우트에서 response wrapping을 비활성화하려면?

`@RawResponse()` 데코레이터를 사용하세요:

```typescript
@Get('health')
@RawResponse()
healthCheck() {
  return { status: 'ok' };
}
```

파일 다운로드, SSE, health check 등에 유용합니다.

### class-transformer의 @Exclude()와 호환되나요?

네. `SafeResponseModule`을 `ClassSerializerInterceptor`보다 먼저 import하면 됩니다. 직렬화가 먼저 실행되고, 그 결과가 response wrapping됩니다.

---

## @nestarc/soft-delete

### soft-delete 후 unique constraint가 충돌합니다

같은 값으로 여러 번 soft-delete하면 표준 unique constraint가 깨집니다. composite unique constraint를 사용하세요:

```prisma
model User {
  id        Int       @id @default(autoincrement())
  email     String
  deletedAt DateTime?

  @@unique([email, deletedAt])
}
```

대부분의 데이터베이스에서 `NULL` 값은 unique index에서 서로 다른 것으로 취급되므로, 활성 레코드 간에는 유니크가 유지됩니다.

### cascade soft-delete의 최대 깊이는?

기본값은 3입니다. `maxCascadeDepth` 옵션으로 조절할 수 있습니다.

---

## @nestarc/feature-flag

### 플래그 평가 우선순위는?

6단계 cascade로 평가되며, 먼저 매칭되는 레이어가 최종 결과입니다:

1. Archived (항상 false)
2. User override
3. Tenant override
4. Environment override
5. Percentage rollout
6. Global default

### percentage rollout은 어떻게 동작하나요?

`flagKey + userId`(또는 `tenantId`)를 murmurhash3로 해시하고 mod 100을 적용합니다. 동일한 사용자는 항상 같은 버킷에 배정되므로 요청 간 결과가 일관됩니다.

---

## @nestarc/audit-log

### audit_logs 테이블의 레코드를 수정/삭제할 수 있나요?

아닙니다. `applyAuditTableSchema`가 PostgreSQL rules를 생성하여 UPDATE와 DELETE를 차단합니다. 이는 감사 로그의 무결성을 보장하기 위한 설계입니다.

### 자동 추적과 수동 로깅의 차이는?

- **자동 추적**: Prisma extension이 CUD 작업을 감지하여 before/after diff를 기록
- **수동 로깅**: `AuditService.log()`로 비즈니스 이벤트(예: "invoice.approved")를 직접 기록

둘 다 같은 `audit_logs` 테이블에 저장됩니다.

---

## @nestarc/pagination

### cursor vs offset 중 어떤 걸 써야 하나요?

- **Offset**: 페이지 번호가 필요한 UI, 총 개수 표시, 관리자 대시보드
- **Cursor**: 무한 스크롤, 대량 데이터셋, 실시간 데이터에서 일관된 결과

`after`/`before` 파라미터가 있으면 자동으로 cursor 모드로 전환됩니다.

### 허용되지 않은 필터 컬럼을 사용하면?

`InvalidFilterColumnError` (400)가 발생합니다. `filterableColumns`에 명시적으로 등록된 컬럼과 연산자만 허용됩니다. 이는 보안을 위한 설계입니다.
