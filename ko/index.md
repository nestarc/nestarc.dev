---
description: "nestarc — SaaS 백엔드를 위한 프로덕션급 NestJS 모듈. 멀티테넌시, 감사 로그, 피처 플래그, 소프트 딜리트, 페이지네이션을 Prisma와 PostgreSQL 기반으로 제공합니다."
layout: home

hero:
  name: nestarc
  text: SaaS 백엔드를 위한 프로덕션급 NestJS 모듈
  tagline: 멀티테넌시, 감사 로그, 피처 플래그 등 — Prisma & PostgreSQL 기반
  actions:
    - theme: brand
      text: 시작하기
      link: /ko/getting-started
    - theme: alt
      text: GitHub에서 보기
      link: https://github.com/nestarc

features:
  - title: tenancy
    details: PostgreSQL RLS + Prisma 멀티테넌시. 행 수준 격리를 즉시 적용할 수 있습니다.
    link: /packages/tenancy/
    linkText: v0.8.0
  - title: safe-response
    details: Swagger 통합, 페이지네이션, i18n을 지원하는 API 응답 래퍼.
    link: /packages/safe-response/
    linkText: v0.13.1
  - title: audit-log
    details: Prisma CUD 자동 추적 — before/after diff로 누가 무엇을 변경했는지 기록합니다.
    link: /packages/audit-log/
    linkText: v0.1.0
  - title: feature-flag
    details: 테넌트 및 사용자 수준 오버라이드를 지원하는 DB 기반 피처 플래그.
    link: /packages/feature-flag/
    linkText: v0.1.0
  - title: soft-delete
    details: 캐스케이드 삭제 및 복원을 지원하는 Prisma 소프트 딜리트 확장.
    link: /packages/soft-delete/
    linkText: v0.2.0
  - title: pagination
    details: 12가지 필터 연산자를 지원하는 커서 + 오프셋 페이지네이션. Swagger와 함께 동작합니다.
    link: /packages/pagination/
    linkText: v0.1.0
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
  letter-spacing: -0.02em;
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
  border-radius: 12px;
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
  border-radius: 12px;
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
</style>

<div class="why-section">

## 왜 nestarc인가?

<p class="subtitle">
  모든 멀티테넌트 SaaS 백엔드는 동일한 6가지 기능이 필요합니다. 이를 직접 구현하면 수 주가 걸리고 미묘한 버그가 생깁니다. nestarc는 이 문제를 한 번에, 올바르게 해결합니다.
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

<div class="cta-box">
  <p><strong>30분 만에 완전한 멀티테넌트 API를 구축하세요.</strong></p>
  <a class="primary" href="/guide/multi-tenant-saas">전체 튜토리얼</a>
  <a class="secondary" href="/ko/getting-started">빠른 시작 (5분)</a>
</div>

</div>
