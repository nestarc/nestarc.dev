import { validatePackageCatalog } from './validate-package-catalog.mjs'

export const packageCategories = [
  {
    id: 'foundation',
    label: 'Foundation',
  },
  {
    id: 'data-safety',
    label: 'Data safety',
  },
  {
    id: 'operations-auth',
    label: 'Operations and auth',
  },
  {
    id: 'async-integration',
    label: 'Async and integration',
  },
  {
    id: 'privacy-compliance',
    label: 'Privacy and compliance',
  },
]

export const adoptionStages = [
  {
    step: 1,
    label: 'SaaS API foundation',
    useWhen: 'You are building tenant-scoped HTTP APIs and want consistent response and list behavior.',
  },
  {
    step: 2,
    label: 'Data safety',
    useWhen: 'Deletes, retries, payments, imports, or external callbacks can corrupt state if handled ad hoc.',
  },
  {
    step: 3,
    label: 'Operational traceability and release control',
    useWhen: 'Teams need traceability, scoped machine access, or controlled rollout.',
  },
  {
    step: 4,
    label: 'Async events',
    useWhen: 'Writes need reliable event fan-out, incoming event deduplication, background work, or outbound delivery.',
  },
  {
    step: 5,
    label: 'Privacy and compliance',
    useWhen: 'Export, erase, retention, and legal basis workflows need consistent policy handling.',
  },
  {
    step: 6,
    label: 'Access control',
    useWhen: 'Controllers and services need consistent tenant-aware authorization and resource scopes.',
  },
]

export const packageNavGroups = [
  { label: 'Foundation', labelKo: '기반', categories: ['foundation'] },
  { label: 'Data safety', labelKo: '데이터 안전', categories: ['data-safety'] },
  { label: 'Operations & auth', labelKo: '운영 및 인증', categories: ['operations-auth'] },
  { label: 'Async & compliance', labelKo: '비동기 및 컴플라이언스', categories: ['async-integration', 'privacy-compliance'] },
]

export const packageCatalog = [
  {
    slug: 'tenancy',
    repository: 'nestjs-tenancy',
    version: '0.16.2',
    releaseProvenance: 'gitHead',
    supportStatus: 'Supported',
    apiStatus: 'Generated',
    category: 'foundation',
    adoptionStage: 1,
    homeSummary: {
      en: 'PostgreSQL TEXT/UUID RLS, Prisma tenancy, live audits, and validated RPC tenant context.',
      ko: 'PostgreSQL TEXT/UUID RLS, Prisma 멀티테넌시, 실시간 DB 감사와 RPC tenant 검증을 제공합니다.',
    },
    solves: 'Tenant context, PostgreSQL RLS, Prisma 6/7 isolation, TEXT/UUID policies, live audits, and validated RPC restoration.',
    startHere: 'You need tenant data isolation enforced below application code.',
    requiresCodeChanges: 'Yes (module + Prisma extension)',
    dependsOn: '—',
  },
  {
    slug: 'safe-response',
    repository: 'nestjs-safe-response',
    version: '0.16.0',
    releaseProvenance: 'slsa',
    supportStatus: 'Supported',
    apiStatus: 'Generated',
    category: 'foundation',
    adoptionStage: 1,
    homeSummary: {
      en: 'API response wrapper with Swagger integration, field selection, error catalogs, and i18n support.',
      ko: 'Swagger 통합, 페이지네이션, 필드 선택, 에러 카탈로그를 갖춘 API 응답 래퍼입니다.',
    },
    solves: 'Consistent API envelopes, errors, field selection, pagination, Swagger helpers.',
    startHere: 'Frontend teams need predictable responses across controllers.',
    requiresCodeChanges: 'Yes (module registration)',
    dependsOn: '—',
  },
  {
    slug: 'pagination',
    repository: 'nestjs-pagination',
    version: '0.3.2',
    releaseProvenance: 'gitHead',
    supportStatus: 'Supported',
    apiStatus: 'Generated',
    category: 'foundation',
    adoptionStage: 1,
    homeSummary: {
      en: 'Prisma 7 cursor, keyset, and offset pagination with filters, sorting, and Swagger helpers.',
      ko: 'Prisma 7, keyset 커서, 필터, 정렬, Swagger helper를 지원하는 페이지네이션입니다.',
    },
    solves: 'Prisma 7 cursor, keyset, and offset pagination with filters, sorting, and Swagger.',
    startHere: 'List endpoints are gaining custom query parsing and repeated DTOs.',
    requiresCodeChanges: 'Yes (decorators on routes)',
    dependsOn: 'Optional: safe-response',
  },
  {
    slug: 'soft-delete',
    repository: 'nestjs-soft-delete',
    version: '0.7.5',
    releaseProvenance: 'gitHead',
    supportStatus: 'Supported',
    apiStatus: 'Generated',
    category: 'data-safety',
    adoptionStage: 2,
    homeSummary: {
      en: 'Prisma soft-delete with relation filters, cascade, bulk restore, purge, events, and optional atomic audit lifecycles.',
      ko: '관계 필터, 캐스케이드 삭제, 일괄 복원, purge, 이벤트, 선택적 원자 감사 수명주기를 지원하는 Prisma soft-delete 확장입니다.',
    },
    solves: 'Prisma 5/6/7 soft delete, relation filters, cascade, bulk restore, purge, and optional atomic audit lifecycles.',
    startHere: 'Deleting records must preserve auditability and avoid accidental reads.',
    requiresCodeChanges: 'Yes (schema + Prisma extension)',
    dependsOn: 'Optional: audit-log, tenancy, @nestjs/event-emitter',
  },
  {
    slug: 'idempotency',
    repository: 'idempotency',
    version: '1.0.0',
    releaseProvenance: 'slsa',
    supportStatus: 'Preview',
    apiStatus: 'Generated',
    category: 'data-safety',
    adoptionStage: 2,
    homeSummary: {
      en: 'HTTP Idempotency-Key handling with hashed request identities, ownership leases, and response replay across memory, Redis, or PostgreSQL.',
      ko: '해시된 요청 식별자, 소유권 lease, memory·Redis·PostgreSQL 저장소를 통한 HTTP Idempotency-Key 및 응답 재생을 제공합니다.',
    },
    solves: 'HTTP request deduplication, versioned hashed keys, bounded response replay, and Redis/PostgreSQL ownership leases.',
    startHere: 'Retries can duplicate payments, orders, refunds, imports, or webhook receivers.',
    requiresCodeChanges: 'Yes (interceptor + decorator)',
    dependsOn: 'Optional: ioredis or pg; @types/pg for PostgreSQL TypeScript consumers',
  },
  {
    slug: 'audit-log',
    repository: 'nestjs-audit-log',
    version: '0.8.0',
    releaseProvenance: 'slsa',
    supportStatus: 'Supported',
    apiStatus: 'Generated',
    category: 'operations-auth',
    adoptionStage: 3,
    homeSummary: {
      en: 'Record who changed what with managed manual transactions, PostgreSQL atomic-required tracking, and PostgreSQL or SQL Server history queries.',
      ko: '수동 트랜잭션 헬퍼와 PostgreSQL atomic-required 추적으로 변경 이력을 기록하고, PostgreSQL·SQL Server에서 조회합니다.',
    },
    solves: 'Managed manual events with validation and diagnostics, PostgreSQL atomic-required Prisma tracking, and tenant-scoped PostgreSQL/SQL Server history.',
    startHere: 'You need to answer who changed what, when, and from where.',
    requiresCodeChanges: 'Yes (audit table + manual event or audited transaction)',
    dependsOn: 'Optional: tenancy',
  },
  {
    slug: 'api-keys',
    repository: 'api-keys',
    version: '0.4.0',
    releaseProvenance: 'slsa',
    supportStatus: 'Preview',
    apiStatus: 'Generated',
    category: 'operations-auth',
    adoptionStage: 3,
    homeSummary: {
      en: 'Tenant-scoped API keys with Prisma 5/6/7 storage, request authorization, atomic rotation, and safe management summaries.',
      ko: 'Prisma 5/6/7 저장소, 요청 권한 검사, 원자적 rotation, 안전한 관리 목록을 갖춘 테넌트 범위 API 키입니다.',
    },
    solves: 'Tenant-scoped API keys, Prisma 5/6/7 storage, request authorization, atomic rotation, IP policy, and safe management APIs.',
    startHere: 'Customers or integrations need scoped machine access with enforceable origin and lifecycle policy.',
    requiresCodeChanges: 'Yes (guards + scopes)',
    dependsOn: 'Optional: Prisma',
  },
  {
    slug: 'feature-flag',
    repository: 'nestjs-feature-flag',
    version: '0.6.0',
    releaseProvenance: 'gitHead',
    supportStatus: 'Supported',
    apiStatus: 'Generated',
    category: 'operations-auth',
    adoptionStage: 3,
    homeSummary: {
      en: 'DB-backed feature flags with cache adapters, Admin API, rollouts, and tenant overrides.',
      ko: '캐시 어댑터, Admin API, rollout, 테넌트 override를 지원하는 DB 기반 플래그입니다.',
    },
    solves: 'Prisma 7 DB-backed flags, typed evaluation, cache adapters, rollout, tenant overrides, Admin API.',
    startHere: 'You want gradual rollout without external flag-service dependency.',
    requiresCodeChanges: 'Yes (decorators on routes)',
    dependsOn: 'Optional: tenancy',
  },
  {
    slug: 'rbac',
    repository: 'rbac',
    version: '0.2.2',
    releaseProvenance: 'slsa',
    supportStatus: 'Supported',
    apiStatus: 'Generated',
    category: 'operations-auth',
    adoptionStage: 6,
    homeSummary: {
      en: 'Typed tenant-aware permissions, identity-source reconciliation, HTTP guards, Prisma 5/6/7 storage, and final decision audits.',
      ko: '타입 안전 권한, 인증 소스 충돌 검사, HTTP guard, Prisma 5/6/7 저장소와 최종 결정 감사를 제공합니다.',
    },
    solves: 'Typed tenant-aware roles, reconciled identities, HTTP guards, resource scopes, Prisma storage, and committed-change hooks.',
    startHere: 'Controllers and services have ad hoc role checks that are starting to drift.',
    requiresCodeChanges: 'Yes (guards + roles)',
    dependsOn: 'Optional: Prisma, tenancy, api-keys',
  },
  {
    slug: 'outbox',
    repository: 'outbox',
    version: '0.4.0',
    releaseProvenance: 'slsa',
    supportStatus: 'Preview',
    apiStatus: 'Generated',
    category: 'async-integration',
    adoptionStage: 4,
    homeSummary: {
      en: 'Prisma transactional outbox with renewable leases, persisted retries, tenant admin scopes, and broker publishing.',
      ko: 'renewable lease, 저장된 retry 일정, 테넌트 관리 범위와 broker 발행을 지원하는 Prisma outbox입니다.',
    },
    solves: 'Transactional outbox, renewable fenced claims, persisted retries, tenant-scoped admin, cursor pages, and publisher delivery.',
    startHere: 'Database writes and event emission must succeed or recover together.',
    requiresCodeChanges: 'Yes (module + event handlers)',
    dependsOn: 'Optional: tenancy',
  },
  {
    slug: 'inbox',
    repository: 'inbox',
    version: '0.2.0',
    releaseProvenance: 'slsa',
    supportStatus: 'Preview',
    apiStatus: 'Generated',
    category: 'async-integration',
    adoptionStage: 4,
    homeSummary: {
      en: 'Transactional inbox for NestJS, Prisma, and PostgreSQL with durable event deduplication, atomic database effects, retries, and replay.',
      ko: 'NestJS·Prisma·PostgreSQL에서 수신 이벤트 중복 제거, 업무 DB 변경과 완료의 원자적 커밋, 재시도와 replay를 제공합니다.',
    },
    solves: 'Durable webhook and broker receipts, retained-identity deduplication, transactional processing, fenced workers, retries, and scoped recovery.',
    startHere: 'Incoming event redeliveries must not repeat committed database work.',
    requiresCodeChanges: 'Yes (SQL schema + handlers + transport acknowledgment)',
    dependsOn: 'Prisma 7.10.1+, PostgreSQL; optional: tenancy',
  },
  {
    slug: 'jobs',
    repository: 'jobs',
    version: '0.4.1',
    releaseProvenance: 'slsa',
    supportStatus: 'Preview',
    apiStatus: 'Generated',
    category: 'async-integration',
    adoptionStage: 4,
    homeSummary: {
      en: 'Typed jobs with bounded tenant-fair local workers, BullMQ producer/worker roles, Redis dedupe, retention, and outbox publishing.',
      ko: '테넌트 공정 local worker pool, BullMQ producer/worker 역할, Redis dedupe, 보존 정책과 outbox 발행을 지원하는 typed job 실행입니다.',
    },
    solves: 'Typed jobs, bounded local concurrency, BullMQ roles, Redis identities, portable JSON, explicit shutdown errors, retention, and outbox publishing.',
    startHere: 'You need shared job handlers across local tests and Redis-backed production workers.',
    requiresCodeChanges: 'Yes (handlers + backend)',
    dependsOn: 'Optional: BullMQ, outbox',
  },
  {
    slug: 'webhook',
    repository: 'webhook',
    version: '0.13.3',
    releaseProvenance: 'gitHead',
    supportStatus: 'Supported',
    apiStatus: 'Generated',
    category: 'async-integration',
    adoptionStage: 4,
    homeSummary: {
      en: 'Idempotent HMAC-signed delivery with Prisma 5/6/7 repositories, retry/replay controls, worker metrics, and retention.',
      ko: 'Prisma 5/6/7 저장소, HMAC 서명, 멱등 발행, retry·replay 제어, worker 지표와 보존 정책을 제공합니다.',
    },
    solves: 'Idempotent HMAC-signed delivery, retry/replay operations, worker observability, and data retention.',
    startHere: 'Your app sends events to customer endpoints.',
    requiresCodeChanges: 'Yes (module + event publishing)',
    dependsOn: 'Optional: tenancy',
  },
  {
    slug: 'data-subject',
    repository: 'data-subject',
    version: '0.3.0',
    releaseProvenance: 'gitHead',
    supportStatus: 'Preview',
    apiStatus: 'Generated',
    category: 'privacy-compliance',
    adoptionStage: 5,
    homeSummary: {
      en: 'Tenant-scoped export and verified erasure with shared policies, signed previews, durable recovery, and paged jobs.',
      ko: '공유 정책, 서명된 미리보기, 영구 실행 복구와 페이지 단위 작업을 갖춘 테넌트 범위 내보내기 및 검증된 삭제입니다.',
    },
    solves: 'Allowlisted export, verified erasure, retention, signed previews, and durable completion recovery.',
    startHere: 'Privacy requests touch invoices, audit logs, tax records, and tenant data.',
    requiresCodeChanges: 'Yes (policies + adapters)',
    dependsOn: 'Optional: outbox',
  },
]

export const toolCatalog = [
  {
    slug: 'mcp-guard',
    repository: 'mcp-guard',
    version: '0.2.0',
    supportStatus: 'Labs',
    homeSummary: {
      en: 'Static security scanning for MCP server implementations and MCP client configuration files.',
      ko: 'MCP 서버와 클라이언트 설정 파일을 정적으로 검사하는 보안 도구입니다.',
    },
    purpose: 'Static scanning for MCP servers and MCP client configuration files.',
  },
]

validatePackageCatalog({
  packageCategories,
  adoptionStages,
  packageNavGroups,
  packageCatalog,
  toolCatalog,
})

function deepFreeze(value) {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.freeze(value)
    for (const nested of Object.values(value)) deepFreeze(nested)
  }
  return value
}

deepFreeze(packageCategories)
deepFreeze(adoptionStages)
deepFreeze(packageNavGroups)
deepFreeze(packageCatalog)
deepFreeze(toolCatalog)

export const generatedApiPackages = Object.freeze(
  packageCatalog.filter(({ apiStatus }) => apiStatus === 'Generated'),
)

export const documentedApiPackages = Object.freeze(
  packageCatalog.filter(({ apiStatus }) => ['Generated', 'Curated'].includes(apiStatus)),
)

export function getPackage(slug) {
  return packageCatalog.find((item) => item.slug === slug)
}
