---
description: "nestarc — 멀티테넌트 SaaS를 위한 오픈소스 NestJS 빌딩 블록과 메타데이터 전용 Reliability 컨트롤 플레인."
layout: home

hero:
  name: nestarc
  text: 신뢰할 수 있는 NestJS SaaS를 구축하고, 비동기 작업이 멈춘 지점을 확인하세요.
  tagline: 오픈소스 모듈은 데이터와 전달 경로를 보호합니다. Nestarc Reliability는 payload를 수집하지 않고 요청, 데이터베이스, 큐, 워커, webhook의 증거를 연결합니다.
  actions:
    - theme: brand
      text: 오픈소스로 시작하기
      link: /ko/getting-started
    - theme: alt
      text: Reliability 살펴보기
      link: https://reliability.nestarc.dev/
      target: _self
    - theme: alt
      text: 패키지 비교
      link: /packages/

features:
  - title: 안전한 경계 만들기
    details: 애플리케이션 안에서 테넌트 격리, 예측 가능한 API 계약, 인가, 감사 추적을 적용합니다.
    link: /ko/getting-started
    linkText: tenancy로 시작하기
  - title: 비동기 작업을 안정적으로 전달하기
    details: 재시도, 데이터베이스 이벤트, 백그라운드 작업, outbound webhook을 명시적이고 복구 가능한 흐름으로 만듭니다.
    link: /packages/
    linkText: reliability primitive 살펴보기
  - title: 증거 연결하기
    details: 기존 큐를 교체하거나 고객 payload를 옮기지 않고, 명시적으로 보고된 메타데이터 전용 증거를 연결합니다.
    link: https://reliability.nestarc.dev/
    linkText: 읽기 전용 파일럿 살펴보기
---

<script setup>
import HomeToolCard from '../.vitepress/theme/components/HomeToolCard.vue'
import PackageCards from '../.vitepress/theme/components/PackageCards.vue'
import PilotEmailLink from '../.vitepress/theme/components/PilotEmailLink.vue'
</script>

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
.reliability-section {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  margin-bottom: 56px;
  padding: 24px;
}
.reliability-section .subtitle {
  margin-bottom: 24px;
}
.reliability-path {
  display: grid;
  gap: 0;
  grid-template-columns: 1fr;
}
@media (min-width: 720px) {
  .reliability-section { padding: 32px; }
  .reliability-path { grid-template-columns: 1fr 1fr; }
}
.reliability-step {
  border-top: 1px solid var(--vp-c-divider);
  padding: 24px 0 0;
}
@media (min-width: 720px) {
  .reliability-step {
    border-left: 1px solid var(--vp-c-divider);
    border-top: 0;
    padding: 0 0 0 28px;
  }
  .reliability-step:first-child {
    border-left: 0;
    padding: 0 28px 0 0;
  }
}
.reliability-step .label {
  color: var(--vp-c-brand-1);
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  margin-bottom: 8px;
  text-transform: uppercase;
}
.reliability-step h3 {
  font-size: 1.15rem;
  margin: 0 0 8px;
}
.reliability-step p {
  color: var(--vp-c-text-2);
  line-height: 1.6;
  margin: 0;
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

<div class="reliability-section">

## 실행은 로컬에 두고, 전체 경로의 실패를 확인하세요.

<p class="subtitle">
  오픈소스 패키지는 실행을 애플리케이션 환경 안에 유지합니다. Nestarc Reliability는 각 시스템이 명시적으로 보고한 제한된 운영 증거만 연결하며, 고객 작업을 실행하거나 request body, webhook payload, raw log, SQL을 수집하지 않습니다.
</p>

<div class="reliability-path">
  <div class="reliability-step">
    <div class="label">오픈소스 데이터 플레인</div>
    <h3>실행 경로를 직접 소유하세요</h3>
    <p>tenancy, idempotency, outbox, jobs, webhook을 NestJS 애플리케이션 안에서 독립적으로 사용하거나 함께 조합할 수 있습니다.</p>
  </div>
  <div class="reliability-step">
    <div class="label">호스팅 컨트롤 플레인</div>
    <h3>증거가 멈춘 지점을 확인하세요</h3>
    <p>하나의 작업을 요청부터 외부 효과까지 추적합니다. 현재 파일럿은 읽기 전용이며 복구 제어는 활성화되지 않습니다.</p>
  </div>
</div>

<div class="package-actions">
  <a class="primary" href="https://reliability.nestarc.dev/">Reliability 살펴보기</a>
  <PilotEmailLink locale="ko" />
</div>

</div>

<div class="package-section">

## 패키지 라인업

<p class="subtitle">
  <strong>Supported</strong> 패키지는 호환성 범위와 운영 가이드를 지속적으로 관리합니다. <strong>Preview</strong> 패키지는 사용할 수 있지만 API와 운영 계약이 아직 발전 중입니다. 상태 표시는 버전 번호나 변경 이력을 대신하지 않습니다.
</p>

<PackageCards locale="ko" />

<div class="package-actions">
  <a class="primary" href="/packages/">모든 패키지 비교</a>
  <a href="/guide/adoption-roadmap">도입 로드맵 보기</a>
</div>

</div>

## 왜 nestarc인가?

<p class="subtitle">
  멀티테넌트 SaaS 팀은 위험도가 높은 기반 기능을 반복해서 구현합니다. nestarc는 명시적인 호환성 범위, 운영 계약, 알려진 제한사항과 함께 테스트된 빌딩 블록을 제공합니다.
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
    <div class="solution">timing-safe 검증, 무중단 rotation, fail-closed IP allowlist, test/live 격리를 제공합니다.</div>
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
    <div class="solution">in-memory weighted fairness와 함께 BullMQ의 durable retry, Redis 기반 dedupe, 재시작 후 상태 조회, first-party outbox 전달을 제공합니다.</div>
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

<HomeToolCard locale="ko" />

</div>

<div class="cta-box">
  <p><strong>30분 만에 완전한 멀티테넌트 API를 구축하세요.</strong></p>
  <a class="primary" href="/guide/multi-tenant-saas">전체 튜토리얼</a>
  <a class="secondary" href="/ko/getting-started">빠른 시작 (5분)</a>
</div>

</div>
