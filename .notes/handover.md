# @nestarc 공식 사이트 프로젝트 Handover

## 프로젝트 개요

@nestarc npm 조직의 공식 웹사이트 및 문서 사이트 구축 프로젝트.

---

## 결정 사항 요약

### 플랫폼 선택: VitePress

- **후보 비교**: VitePress, Docusaurus, Starlight(Astro), Nextra(Next.js), NestJS, Ghost
- **탈락 사유**:
  - NestJS: API 서버 프레임워크로 정적 문서 사이트에 부적합. 별도 프론트엔드 필요, 호스팅 비용 발생
  - Ghost: 블로그 CMS로 기술 문서 관리에 부적합. 사이드바 네비게이션, 코드 블록 구문 강조, Git 연동 부재
  - Docusaurus: 가능하지만 Tailwind 통합 어려움(Infima 종속), 빌드 느림
  - Starlight: 가장 높은 점수였으나 VitePress로 최종 결정
  - Nextra: 문서 사이트에 오버스펙
- **VitePress 선택 이유**: 빌드 속도, 멀티 사이드바 지원, 로컬 검색 내장, npm 주간 다운로드 ~2M으로 안정적

### 배포: Cloudflare Pages

- GitHub Pages 대신 Cloudflare Pages 선택
- 무료 플랜, 대역폭 무제한, PR별 Preview Deployment 지원
- 빌드 설정: 프레임워크 프리셋 VitePress → 빌드 `npm run docs:build` → 출력 `.vitepress/dist`
- 커스텀 도메인: nestarc.dev (확보 완료)

### GitHub 레포

- **조직**: nestarc
- **레포 이름**: `nestarc.dev`
- **Description**: `Official website and documentation for @nestarc — production-ready NestJS modules for SaaS backends`
- **Visibility**: Public
- **README**: On
- **.gitignore**: Node
- **License**: MIT

### 블로그 전략

- 기술 문서, 딥다이브 글, 릴리즈 스토리, 튜토리얼 모두 nestarc.dev에서 통합 운영

---

## @nestarc 패키지 현황 (2026-04-05 기준)

| 패키지 | 버전 | 설명 | 주간 DL |
|--------|------|------|---------|
| `@nestarc/tenancy` | 0.8.0 | PostgreSQL RLS + Prisma 멀티테넌시 | 498 |
| `@nestarc/safe-response` | 0.13.1 | API 응답 래퍼, Swagger, 페이지네이션, i18n | - |
| `@nestarc/audit-log` | 0.1.0 | Prisma CUD 자동 추적, before/after diff | - |
| `@nestarc/feature-flag` | 0.1.0 | DB 기반 피처 플래그, 테넌트/유저별 오버라이드 | - |
| `@nestarc/soft-delete` | 0.2.0 | Prisma soft-delete extension, cascade/restore | - |
| `@nestarc/pagination` | 0.1.0 | Cursor + offset 페이지네이션, 12개 필터 연산자 | - |

공통 기술 스택: NestJS 10/11, Prisma 5/6, PostgreSQL, TypeScript

---

## 추천 사이트 메뉴 구성

### 1단계 (MVP)

```
Home (랜딩)
├── 한 줄 타이틀: "Production-ready NestJS modules for SaaS backends"
├── 6개 패키지 카드 + npm install 명령어
└── "Get Started in 5 minutes" CTA

Getting Started
├── Prerequisites (NestJS, Prisma, PostgreSQL 버전)
├── Quick Start: tenancy 설치 → RLS 설정 → 첫 API 호출
└── Stack Overview: 패키지 간 관계도

Packages (각 패키지별 서브 메뉴)
├── tenancy/ — Introduction, Installation, Extractors, Lifecycle Hooks,
│              Microservice Propagation, CLI, Testing, Migration Guide
├── safe-response/ — Installation, Response Format, Pagination, Error Codes, Swagger
├── audit-log/ — Installation, Auto Tracking, Manual Logging, Query API
├── feature-flag/ — Installation, Guard & Decorator, Rollout, Tenant Overrides
├── soft-delete/ — Installation, Cascade, Restore/Purge, Decorators, Events
└── pagination/ — Installation, Offset vs Cursor, Filters & Sorting, Swagger

Guides (cross-cutting)
├── Building a multi-tenant SaaS from scratch
├── Adding audit trail to existing app
├── Feature flags for gradual rollout
└── Prisma extension chaining (tenancy + soft-delete + pagination)

API Reference
└── 각 패키지 TypeDoc 자동 생성

Community
├── GitHub Discussions 링크
├── Contributing Guide
└── Roadmap
```

### 2단계 (성장 후)

- Showcase / Who's Using
- Pricing / Sponsorship
- Playground (StackBlitz embed)

---

## 다음 세션에서 할 일

1. **VitePress 프로젝트 초기화**: `nestarc.dev` 레포에 VitePress 프로젝트 scaffolding
2. **config 설정**: `.vitepress/config.ts` — nav, sidebar (패키지 6개 멀티 사이드바), 로컬 검색, 다크모드
3. **랜딩 페이지**: 커스텀 홈 레이아웃 (Hero + 패키지 카드 그리드)
4. **기존 README 이관**: 각 패키지 npm README를 페이지별 .md 파일로 분리
5. **Cloudflare Pages 연동**: GitHub 레포 연결 → 빌드 설정 → nestarc.dev 도메인 연결
6. **GitHub Actions**: main 브랜치 push 시 자동 빌드/배포 (Cloudflare Pages는 자체 CI도 가능)

---

## 참고 링크

- npm 조직: https://www.npmjs.com/org/nestarc
- 도메인: nestarc.dev (Cloudflare DNS)
- VitePress 공식 문서: https://vitepress.dev
- Cloudflare Pages VitePress 가이드: https://developers.cloudflare.com/pages/framework-guides/deploy-a-vitepress-site/