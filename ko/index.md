---
description: "nestarc — SaaS 백엔드를 위한 프로덕션급 NestJS 모듈. 멀티테넌시, API 일관성, 감사 추적, 접근 제어, 안정적인 이벤트 처리, 테넌트별 운영 기능을 조합 가능한 패키지로 제공합니다."
layout: home

hero:
  name: nestarc
  text: SaaS 백엔드를 위한 프로덕션급 NestJS 모듈
  tagline: 멀티테넌시, API 일관성, 감사 추적, RBAC, 안정적인 이벤트 처리 등 — Prisma & PostgreSQL 기반
  actions:
    - theme: brand
      text: 시작하기
      link: /ko/getting-started
    - theme: alt
      text: 패키지 비교
      link: /packages/
    - theme: alt
      text: Reliability 살펴보기
      link: https://reliability.nestarc.dev/
      target: _self

features:
  - title: SaaS API 기반
    details: 테넌트 격리, 일관된 응답, 재사용 가능한 목록 API부터 시작합니다.
    link: /packages/
    linkText: Step 1 · tenancy, safe-response, pagination
  - title: 데이터 안전성
    details: 재시도, 삭제, import, 결제가 상태를 망가뜨리기 전에 soft delete와 멱등성을 추가합니다.
    link: /packages/
    linkText: Step 2 · soft-delete, idempotency
  - title: 운영과 인증/인가
    details: 감사 가능성, machine access, 릴리스 제어, 테넌트 인식 인가를 더합니다.
    link: /packages/
    linkText: Step 3 · audit-log, api-keys, feature-flag, rbac
  - title: 비동기와 통합
    details: side effect, 백그라운드 작업, outbound webhook을 신뢰 가능한 전달 흐름으로 옮깁니다.
    link: /packages/
    linkText: Step 4 · outbox, jobs, webhook
  - title: 프라이버시와 컴플라이언스
    details: export, erase, anonymization, retention 정책을 수동 처리 전에 모델링합니다.
    link: /packages/
    linkText: Step 5 · data-subject
---

<style>
.why-section {
  max-width: 960px;
  margin: 0 auto;
  padding: 64px 24px;
}
.why-section h2 {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 12px;
  letter-spacing: 0;
}
.package-section {
  margin-bottom: 56px;
}
.package-section h2 {
  margin-bottom: 12px;
}
.package-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  margin: 24px 0;
}
@media (min-width: 720px) {
  .package-grid { grid-template-columns: 1fr 1fr; }
}
@media (min-width: 960px) {
  .package-grid { grid-template-columns: 1fr 1fr 1fr; }
}
.package-card {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  color: var(--vp-c-text-1);
  display: block;
  min-height: 170px;
  padding: 16px;
  text-decoration: none;
}
.vp-doc a.package-card,
.vp-doc a.package-card:hover {
  text-decoration: none;
}
.package-card:hover {
  border-color: var(--vp-c-brand-1);
}
.package-card .status {
  color: var(--vp-c-brand-1);
  font-size: 0.8rem;
  font-weight: 700;
  margin-bottom: 8px;
  text-transform: uppercase;
}
.package-card .title {
  color: var(--vp-c-text-1);
  display: block;
  font-weight: 700;
  margin-bottom: 8px;
}
.package-card p {
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
  line-height: 1.5;
  margin: 0;
}
.package-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 20px;
}
.package-actions a {
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  color: var(--vp-c-text-1);
  display: inline-block;
  font-weight: 600;
  padding: 10px 14px;
  text-decoration: none;
}
.package-actions a.primary {
  background: var(--vp-c-brand-3);
  border-color: var(--vp-c-brand-3);
  color: #fff;
}
.status-note {
  color: var(--vp-c-text-2);
  font-size: 0.92rem;
  line-height: 1.6;
}
.why-section .subtitle {
  color: var(--vp-c-text-2);
  font-size: 1.1rem;
  margin-bottom: 40px;
  line-height: 1.6;
}
.pain-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  margin-bottom: 48px;
}
@media (min-width: 640px) {
  .pain-grid { grid-template-columns: 1fr 1fr; }
}
@media (min-width: 960px) {
  .pain-grid { grid-template-columns: 1fr 1fr 1fr; }
}
.pain-card {
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  padding: 24px;
}
.pain-card .label {
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--vp-c-text-3);
  margin-bottom: 8px;
}
.pain-card .problem {
  color: var(--vp-c-text-2);
  font-size: 0.95rem;
  line-height: 1.5;
  margin-bottom: 8px;
}
.pain-card .solution {
  color: var(--vp-c-brand-1);
  font-weight: 500;
  font-size: 0.9rem;
}
.before-after {
  margin-bottom: 48px;
}
.before-after h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 16px;
}
.cta-box {
  background: var(--vp-c-brand-soft);
  border-radius: 8px;
  padding: 32px;
  text-align: center;
}
.cta-box p {
  margin-bottom: 16px;
  font-size: 1.05rem;
}
.cta-box a {
  display: inline-block;
  padding: 10px 24px;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  margin: 0 8px;
}
.cta-box .primary {
  background: var(--vp-c-brand-3);
  color: #fff;
}
.cta-box .secondary {
  border: 1px solid var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}
.tooling-section {
  margin: 0 0 48px;
}
.tooling-section h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 8px;
}
.tooling-card {
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  padding: 24px;
}
.tooling-card .label {
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--vp-c-text-3);
  margin-bottom: 8px;
}
.tooling-card p {
  color: var(--vp-c-text-2);
  line-height: 1.6;
  margin: 0 0 12px;
}
.tooling-card a {
  color: var(--vp-c-brand-1);
  font-weight: 600;
}
</style>

<div class="why-section">

<div class="package-section">

## 패키지 라인업

<p class="subtitle">
  패키지 카드의 <strong>Core</strong>는 문서와 생성 API 레퍼런스가 성숙한 모듈, <strong>Beta</strong>는 공개 패키지이며 생성 API 레퍼런스를 확장 중인 모듈을 뜻합니다.
</p>

<div class="package-grid">
  <a class="package-card" href="/packages/tenancy/">
    <span class="status">Core · v0.13.0</span>
    <span class="title">tenancy</span>
    <p>PostgreSQL RLS + Prisma 멀티테넌시와 테넌트 인식 캐시 키로 데이터 격리를 제공합니다.</p>
  </a>
  <a class="package-card" href="/packages/safe-response/">
    <span class="status">Core · v0.15.0</span>
    <span class="title">safe-response</span>
    <p>Swagger 통합, 페이지네이션, 필드 선택, 에러 카탈로그를 갖춘 API 응답 래퍼입니다.</p>
  </a>
  <a class="package-card" href="/packages/pagination/">
    <span class="status">Core · v0.1.0</span>
    <span class="title">pagination</span>
    <p>필터, 정렬, Swagger helper를 포함한 커서 및 오프셋 페이지네이션입니다.</p>
  </a>
  <a class="package-card" href="/packages/soft-delete/">
    <span class="status">Core · v0.4.0</span>
    <span class="title">soft-delete</span>
    <p>캐스케이드 삭제, 복원, purge, 이벤트를 지원하는 Prisma soft-delete 확장입니다.</p>
  </a>
  <a class="package-card" href="/packages/audit-log/">
    <span class="status">Core · v0.2.0</span>
    <span class="title">audit-log</span>
    <p>Prisma CUD 추적, Query API, retention, partition, actor metadata를 제공합니다.</p>
  </a>
  <a class="package-card" href="/packages/feature-flag/">
    <span class="status">Core · v0.3.0</span>
    <span class="title">feature-flag</span>
    <p>캐시 어댑터, Admin API, rollout, 테넌트 override를 지원하는 DB 기반 플래그입니다.</p>
  </a>
  <a class="package-card" href="/packages/idempotency/">
    <span class="status">Beta · v0.4.0</span>
    <span class="title">idempotency</span>
    <p>IETF draft-07 Idempotency-Key, 안정적인 fingerprint, Redis/Postgres 저장소, 응답/헤더 재생을 제공합니다.</p>
  </a>
  <a class="package-card" href="/packages/api-keys/">
    <span class="status">Beta · v0.1.0</span>
    <span class="title">api-keys</span>
    <p>해싱, versioned pepper, live/test 환경, scope를 갖춘 테넌트 범위 API 키입니다.</p>
  </a>
  <a class="package-card" href="/packages/rbac/">
    <span class="status">Core · v0.2.0</span>
    <span class="title">rbac</span>
    <p>타입 안전 권한, fail-closed guard, resource scope, Prisma 저장소, audit hook을 제공합니다.</p>
  </a>
  <a class="package-card" href="/packages/outbox/">
    <span class="status">Beta · v0.1.0</span>
    <span class="title">outbox</span>
    <p>polling, retry, event decorator를 갖춘 Prisma 네이티브 transactional outbox입니다.</p>
  </a>
  <a class="package-card" href="/packages/jobs/">
    <span class="status">Beta · v0.1.0</span>
    <span class="title">jobs</span>
    <p>in-memory scheduler, BullMQ, context propagation을 갖춘 테넌트 공정 백그라운드 작업입니다.</p>
  </a>
  <a class="package-card" href="/packages/webhook/">
    <span class="status">Core · v0.13.0</span>
    <span class="title">webhook</span>
    <p>HMAC 서명, 멱등 발행, retry·replay 제어, worker 지표, 데이터 보존 정책을 갖춘 outbound webhook 전달입니다.</p>
  </a>
  <a class="package-card" href="/packages/data-subject/">
    <span class="status">Beta · v0.1.0</span>
    <span class="title">data-subject</span>
    <p>entity policy, retention, outbox fan-out을 갖춘 GDPR/CCPA export 및 erase 워크플로입니다.</p>
  </a>
</div>

<div class="package-actions">
  <a class="primary" href="/packages/">모든 패키지 비교</a>
  <a href="/guide/adoption-roadmap">도입 로드맵 보기</a>
</div>

</div>

## 왜 nestarc인가?

<p class="subtitle">
  모든 멀티테넌트 SaaS 백엔드는 같은 운영 빌딩 블록들이 필요합니다. 이를 직접 구현하면 수 주가 걸리고 미묘한 버그가 생깁니다. nestarc는 이 문제를 한 번에, 올바르게 해결합니다.
</p>

<div class="pain-grid">
  <div class="pain-card">
    <div class="label">테넌트 격리</div>
    <div class="problem">쿼리 하나 잘못 쓰면 고객 데이터가 다른 테넌트에 노출됩니다.</div>
    <div class="solution">PostgreSQL RLS가 데이터베이스 수준에서 격리를 보장합니다.</div>
  </div>
  <div class="pain-card">
    <div class="label">감사 추적</div>
    <div class="problem">모든 쓰기 작업에 수동으로 로그를 남기는 건 번거롭고 빠뜨리기 쉽습니다.</div>
    <div class="solution">Prisma 확장이 CUD를 자동 추적하고 before/after diff를 기록합니다.</div>
  </div>
  <div class="pain-card">
    <div class="label">피처 플래그</div>
    <div class="problem">외부 플래그 서비스는 지연, 비용, 새로운 의존성을 추가합니다.</div>
    <div class="solution">DB 기반 플래그로 테넌트 오버라이드와 퍼센트 롤아웃을 지원합니다.</div>
  </div>
  <div class="pain-card">
    <div class="label">소프트 딜리트</div>
    <div class="problem">deletedAt만으로는 유니크 제약 조건이 깨지고 삭제된 레코드가 노출됩니다.</div>
    <div class="solution">캐스케이드, 복원, 쿼리 필터링을 갖춘 Prisma 확장으로 해결합니다.</div>
  </div>
  <div class="pain-card">
    <div class="label">페이지네이션</div>
    <div class="problem">커서 + 오프셋에 필터까지 구현하면 보일러플레이트가 넘칩니다.</div>
    <div class="solution">12가지 필터 연산자, 정렬, Swagger 문서를 즉시 사용할 수 있습니다.</div>
  </div>
  <div class="pain-card">
    <div class="label">응답 표준화</div>
    <div class="problem">엔드포인트마다 다른 API 응답 형식은 프론트엔드 팀을 힘들게 합니다.</div>
    <div class="solution">에러 코드, 페이지네이션, i18n이 포함된 자동 래핑 응답을 제공합니다.</div>
  </div>
  <div class="pain-card">
    <div class="label">멱등성</div>
    <div class="problem">네트워크 재시도는 중복 결제, 중복 주문, 손상된 상태를 만들 수 있습니다.</div>
    <div class="solution">IETF draft-07 Idempotency-Key 처리, fingerprint 검증, 응답 재생으로 중복 실행을 막습니다.</div>
  </div>
  <div class="pain-card">
    <div class="label">트랜잭션 outbox</div>
    <div class="problem">DB 쓰기와 이벤트 발행이 어긋나면 이벤트가 유실되거나 중복될 수 있습니다.</div>
    <div class="solution">Prisma 네이티브 outbox가 polling, SKIP LOCKED, backoff 재시도를 처리합니다.</div>
  </div>
  <div class="pain-card">
    <div class="label">Webhook 전달</div>
    <div class="problem">신뢰할 수 있는 outbound webhook에는 재시도, 서명, 회로 차단, 감사 추적이 필요합니다.</div>
    <div class="solution">HMAC 서명, exponential backoff, circuit breaker, 전송 로그를 제공합니다.</div>
  </div>
  <div class="pain-card">
    <div class="label">API 키</div>
    <div class="problem">키 해싱, prefix, rotation을 직접 만들면 작은 버그 하나가 자격 증명 유출로 이어집니다.</div>
    <div class="solution">SHA-256 + versioned pepper, Stripe 스타일 prefix, test/live 격리를 제공합니다.</div>
  </div>
  <div class="pain-card">
    <div class="label">접근 제어</div>
    <div class="problem">임시 role 체크는 컨트롤러, 서비스, 테넌트, 리소스 범위마다 쉽게 흩어집니다.</div>
    <div class="solution">테넌트 인식 RBAC로 역할, 권한, guard를 일관되게 관리합니다.</div>
  </div>
  <div class="pain-card">
    <div class="label">개인정보 권리 요청</div>
    <div class="problem">GDPR/CCPA export와 erase 요청은 세금, 감사, 법적 보존 요구와 충돌합니다.</div>
    <div class="solution">엔티티별 delete/anonymize/retain 정책, legal basis 추적, outbox fan-out을 지원합니다.</div>
  </div>
  <div class="pain-card">
    <div class="label">백그라운드 작업</div>
    <div class="problem">한 테넌트의 과도한 backlog가 일반 FIFO 큐에서 다른 테넌트의 작업을 굶길 수 있습니다.</div>
    <div class="solution">최소 share를 보장하는 weighted tenant-fair scheduler와 BullMQ 백엔드를 제공합니다.</div>
  </div>
</div>

<div class="before-after">

### nestarc 없이

```typescript
// 50개 이상의 서비스에 흩어져 있고, 빠뜨리기 쉽고, 감사하기 어렵습니다
async updateUser(id: string, dto: UpdateUserDto) {
  const before = await this.prisma.user.findUnique({ where: { id } });
  await this.prisma.$executeRaw`SELECT set_config('app.current_tenant', ${tenantId}, true)`;
  const after = await this.prisma.user.update({ where: { id, deletedAt: null }, data: dto });
  await this.auditService.log({ action: 'user.update', before, after });
  return { success: true, data: after, timestamp: new Date() };
}
```

### nestarc와 함께

```typescript
// 테넌트 격리, 감사 로그, 소프트 딜리트 필터링, 응답 래핑이
// Prisma 확장과 NestJS 인터셉터에 의해 자동으로 처리됩니다.
async updateUser(id: string, dto: UpdateUserDto) {
  return this.prisma.user.update({ where: { id }, data: dto });
}
```

</div>

<div class="tooling-section">

### 도구

<div class="tooling-card">
  <div class="label">Labs · mcp-guard · v0.2.0</div>
  <p>MCP 서버와 클라이언트 설정 파일을 정적으로 검사하는 보안 도구입니다. @nestarc 스코프로 배포되지만, NestJS SaaS 모듈 목록과는 분리해 다룹니다.</p>
  <a href="/tools/">도구 보기 →</a>
</div>

</div>

<div class="cta-box">
  <p><strong>30분 만에 완전한 멀티테넌트 API를 구축하세요.</strong></p>
  <a class="primary" href="/guide/multi-tenant-saas">전체 튜토리얼</a>
  <a class="secondary" href="/ko/getting-started">빠른 시작 (5분)</a>
</div>

</div>
