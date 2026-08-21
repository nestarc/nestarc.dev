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
    useWhen: 'Writes need reliable event fan-out, background work, or outbound delivery.',
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
    version: '0.14.0',
    releaseProvenance: 'gitHead',
    supportStatus: 'Supported',
    apiStatus: 'Generated',
    category: 'foundation',
    adoptionStage: 1,
    homeSummary: {
      en: 'PostgreSQL RLS + Prisma multi-tenancy with tenant-aware cache keys.',
      ko: 'PostgreSQL RLS + Prisma 멀티테넌시와 테넌트 인식 캐시 키로 데이터 격리를 제공합니다.',
    },
    solves: 'Tenant context, PostgreSQL RLS, Prisma 7 query isolation, tenant-aware cache keys.',
    startHere: 'You need tenant data isolation enforced below application code.',
    requiresCodeChanges: 'Yes (module + Prisma extension)',
    dependsOn: '—',
  },
  {
    slug: 'safe-response',
    repository: 'nestjs-safe-response',
    version: '0.15.0',
    releaseProvenance: 'gitHead',
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
    version: '0.3.0',
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
    version: '0.6.0',
    releaseProvenance: 'gitHead',
    supportStatus: 'Supported',
    apiStatus: 'Generated',
    category: 'data-safety',
    adoptionStage: 2,
    homeSummary: {
      en: 'Prisma soft-delete with relation filters, cascade, bulk restore, purge, and lifecycle events.',
      ko: '관계 필터, 캐스케이드 삭제, 일괄 복원, purge, 수명주기 이벤트를 지원하는 Prisma soft-delete 확장입니다.',
    },
    solves: 'Prisma 7 soft delete, relation filters, cascade, bulk restore, purge, and event hooks.',
    startHere: 'Deleting records must preserve auditability and avoid accidental reads.',
    requiresCodeChanges: 'Yes (schema + Prisma extension)',
    dependsOn: '—',
  },
  {
    slug: 'idempotency',
    repository: 'idempotency',
    version: '0.4.0',
    releaseProvenance: 'gitHead',
    supportStatus: 'Preview',
    apiStatus: 'Generated',
    category: 'data-safety',
    adoptionStage: 2,
    homeSummary: {
      en: 'IETF draft-07 Idempotency-Key handling with stable fingerprints, Redis/Postgres storage, and response/header replay.',
      ko: 'IETF draft-07 Idempotency-Key, 안정적인 fingerprint, Redis/Postgres 저장소, 응답/헤더 재생을 제공합니다.',
    },
    solves: 'IETF draft-07-compatible `Idempotency-Key`, stable fingerprinting, response/header replay, Redis/Postgres storage.',
    startHere: 'Retries can duplicate payments, orders, refunds, imports, or webhook receivers.',
    requiresCodeChanges: 'Yes (interceptor + decorator)',
    dependsOn: 'Optional: ioredis',
  },
  {
    slug: 'audit-log',
    repository: 'nestjs-audit-log',
    version: '0.4.0',
    releaseProvenance: 'slsa',
    supportStatus: 'Preview',
    apiStatus: 'Generated',
    category: 'operations-auth',
    adoptionStage: 3,
    homeSummary: {
      en: 'Atomic Prisma change tracking with checkpointed export, durable streams, and retention controls.',
      ko: '원자적 Prisma 변경 추적, 체크포인트 내보내기, 내구성 스트림, retention 제어를 제공합니다.',
    },
    solves: 'Atomic Prisma tracking, checkpointed CSV export, durable SIEM streams, retention, and partitions.',
    startHere: 'You need to answer who changed what, when, and from where.',
    requiresCodeChanges: 'Yes (audit table + Prisma extension)',
    dependsOn: 'Optional: tenancy',
  },
  {
    slug: 'api-keys',
    repository: 'api-keys',
    version: '0.3.0',
    releaseProvenance: 'gitHead',
    supportStatus: 'Preview',
    apiStatus: 'Generated',
    category: 'operations-auth',
    adoptionStage: 3,
    homeSummary: {
      en: 'Tenant-scoped API keys with zero-downtime rotation, IP allowlists, lifecycle hooks, and verification metrics.',
      ko: '무중단 rotation, IP allowlist, lifecycle hook, 검증 metric을 갖춘 테넌트 범위 API 키입니다.',
    },
    solves: 'Tenant-scoped API keys, rotation, IP allowlists, lifecycle hooks, and verification metrics.',
    startHere: 'Customers or integrations need scoped machine access with enforceable origin and lifecycle policy.',
    requiresCodeChanges: 'Yes (guards + scopes)',
    dependsOn: 'Optional: Prisma',
  },
  {
    slug: 'feature-flag',
    repository: 'nestjs-feature-flag',
    version: '0.5.0',
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
    version: '0.2.0',
    releaseProvenance: 'gitHead',
    supportStatus: 'Supported',
    apiStatus: 'Generated',
    category: 'operations-auth',
    adoptionStage: 6,
    homeSummary: {
      en: 'Typed tenant-aware permissions, fail-closed guards, resource scopes, Prisma storage, and audit hooks.',
      ko: '타입 안전 권한, fail-closed guard, resource scope, Prisma 저장소, audit hook을 제공합니다.',
    },
    solves: 'Typed tenant-aware roles, fail-closed guards, resource scopes, Prisma storage, and audit hooks.',
    startHere: 'Controllers and services have ad hoc role checks that are starting to drift.',
    requiresCodeChanges: 'Yes (guards + roles)',
    dependsOn: 'Optional: Prisma, tenancy, api-keys',
  },
  {
    slug: 'outbox',
    repository: 'outbox',
    version: '0.2.0',
    releaseProvenance: 'gitHead',
    supportStatus: 'Preview',
    apiStatus: 'Generated',
    category: 'async-integration',
    adoptionStage: 4,
    homeSummary: {
      en: 'Prisma-native transactional outbox with polling, retry, and event decorators.',
      ko: 'polling, retry, event decorator를 갖춘 Prisma 네이티브 transactional outbox입니다.',
    },
    solves: 'Transactional outbox, polling, SKIP LOCKED, retry, event decorators.',
    startHere: 'Database writes and event emission must succeed or recover together.',
    requiresCodeChanges: 'Yes (module + event handlers)',
    dependsOn: 'Optional: tenancy',
  },
  {
    slug: 'jobs',
    repository: 'jobs',
    version: '0.3.0',
    releaseProvenance: 'slsa',
    supportStatus: 'Preview',
    apiStatus: 'Generated',
    category: 'async-integration',
    adoptionStage: 4,
    homeSummary: {
      en: 'Typed jobs with tenant-fair in-memory scheduling, restart-safe BullMQ workers, Redis dedupe, retries, and outbox publishing.',
      ko: '테넌트 공정 in-memory scheduling, 재시작 안전 BullMQ worker, Redis dedupe, retry, outbox 발행을 갖춘 typed job 실행입니다.',
    },
    solves: 'Typed job contracts, tenant-fair local scheduling, restart-safe BullMQ execution, Redis idempotency/dedupe, retries, graceful shutdown, and outbox publishing.',
    startHere: 'You need shared job handlers across local tests and Redis-backed production workers.',
    requiresCodeChanges: 'Yes (handlers + backend)',
    dependsOn: 'Optional: BullMQ, outbox',
  },
  {
    slug: 'webhook',
    repository: 'webhook',
    version: '0.13.0',
    releaseProvenance: 'gitHead',
    supportStatus: 'Supported',
    apiStatus: 'Generated',
    category: 'async-integration',
    adoptionStage: 4,
    homeSummary: {
      en: 'Idempotent outbound delivery with HMAC signing, retry and replay controls, worker metrics, and data retention.',
      ko: 'HMAC 서명, 멱등 발행, retry·replay 제어, worker 지표, 데이터 보존 정책을 갖춘 outbound webhook 전달입니다.',
    },
    solves: 'Idempotent HMAC-signed delivery, retry/replay operations, worker observability, and data retention.',
    startHere: 'Your app sends events to customer endpoints.',
    requiresCodeChanges: 'Yes (module + event publishing)',
    dependsOn: 'Optional: tenancy',
  },
  {
    slug: 'data-subject',
    repository: 'data-subject',
    version: '0.2.0',
    releaseProvenance: 'gitHead',
    supportStatus: 'Preview',
    apiStatus: 'Generated',
    category: 'privacy-compliance',
    adoptionStage: 5,
    homeSummary: {
      en: 'GDPR/CCPA export and erase workflows with entity policies, retention, and outbox fan-out.',
      ko: 'entity policy, retention, outbox fan-out을 갖춘 GDPR/CCPA export 및 erase 워크플로입니다.',
    },
    solves: 'GDPR/CCPA export and erase policies, retention, anonymization, outbox fan-out.',
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
