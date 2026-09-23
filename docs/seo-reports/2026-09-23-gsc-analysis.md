# nestarc.dev 검색 실적 분석과 SEO 개선 우선순위

분석일: 2026-09-23 (Asia/Seoul)

검색 노출과 클릭은 개선되고 있다. 다음 작업은 노출이 많은 기존 글의 정확성, 검색 의도 적합성, 패키지 도입 경로를 개선하는 데 집중하는 것이 타당하다. 이번 공개 사이트 점검에서는 긴급한 크롤링 결함을 발견하지 못했다.

처음에는 읽기 전용으로 조사했다. 이후 사용자의 개선 작업 지시에 따라 아래 8절의 콘텐츠 수정을 반영했다. 원본 Excel은 수정하지 않았다.

## 1. 자료와 계산 기준

- 원본: `nestarc.dev-Performance-on-Search-2026-09-23.xlsx`.
- 검색 유형: 웹. `필터!A2:B3`에는 “지난 3개월”이 선택되어 있다.
- 실제 일별 관측: **2026-08-13~2026-09-20, 39일**. 9월 21~23일 실적은 이 파일에 없다.
- 전체 실적은 `차트!A2:E40`을 기준으로 계산했다. 국가·기기 합계와도 대조했다.
- CTR = 클릭 합계 ÷ 노출 합계. 평균 순위는 반올림된 일별 순위의 노출 가중 평균이므로 근삿값이다. 일별 CTR의 단순 평균을 사용하지 않았다.
- 날짜별 원본을 별도로 재집계하여 결과를 교차 확인했다. GSC 일별 날짜는 PT 기준이며 KST 배포 시각과 비교할 때 시간대 차이를 고려해야 한다. [Google 날짜·집계 안내](https://support.google.com/webmasters/answer/17011259?hl=en)

| 구분 | 기간 | 클릭 | 노출 | CTR | 평균 순위(약) |
|---|---|---:|---:|---:|---:|
| 전체 | 8/13~9/20 | 42 | 3,921 | 1.07% | 14.48 |
| 이전 14일 | 8/24~9/6 | 12 | 1,595 | 0.75% | 18.02 |
| 최근 14일 | 9/7~9/20 | 25 | 1,699 | 1.47% | 7.18 |

14일 비교 출처: `차트!A13:E26`, `차트!A27:E40`.

최근 14일은 클릭 +108.3%, 노출 +6.5%, CTR +0.72%p다. 9월 1일부터 일별 평균 순위가 대체로 6~8위대로 이동했다. 다만 검색어·국가 구성 변화와 개별 페이지 순위 개선을 분리할 자료가 없어, 특정 SEO 변경의 효과로 귀속할 수는 없다.

최근 7일(9/14~9/20)은 전주 대비 노출이 1,011→688로 31.9% 감소했지만 클릭은 12→13, CTR은 1.19%→1.89%다. 작은 표본의 일시적 변화이므로 사이트 전체가 악화되었다고 결론 내리지 않는다.

## 2. 전체 실적과 검색어 표를 혼동하지 않기

| 차원 | 행 수 | 클릭 합계 | 노출 합계 | 해석 |
|---|---:|---:|---:|---|
| 날짜 | 39 | 42 | 3,921 | 전체 속성 기준 |
| 국가 | 112 | 42 | 3,921 | 전체 합계와 일치 |
| 기기 | 3 | 42 | 3,921 | 전체 합계와 일치 |
| 페이지 | 116 | 42 | 4,888 | 페이지 단위 집계 |
| 검색어 | 52 | 8 | 410 | 공개된 검색어만 포함 |

출처: 각 시트의 헤더 다음 행부터 마지막 행. 페이지 `A2:E117`, 검색어 `A2:E53`, 국가 `A2:E113`, 기기 `A2:E4`.

검색어 표는 전체 노출의 **10.46%**, 클릭의 **19.05%**만 보여준다. 익명화 검색어와 내부 데이터 제한 때문에 검색어 표에서 일부 실적이 빠질 수 있다. 빠진 3,511회 노출의 검색어를 추정해 채우지 않았다. 페이지 노출 합계가 전체보다 큰 것은 집계 단위가 다르기 때문이며 중복 색인 오류를 뜻하지 않는다. [Google 검색어 제한·집계 설명](https://support.google.com/webmasters/answer/17011259?hl=en), [속성·페이지 집계 예시](https://support.google.com/webmasters/answer/7576553?hl=en)

이 파일에는 검색어×페이지, 페이지×날짜, 국가×페이지 교차 자료가 없다. 따라서 키워드 자기경쟁, 특정 페이지의 미국 CTR, 최근 성장의 원인을 확정할 수 없다. `검색 노출` 시트가 비어 있다는 이유로 구조화 데이터가 잘못되었다고 판단할 수도 없다.

## 3. 페이지별 기회

| 페이지 | 클릭 | 노출 | CTR | 평균 순위 | 우선 판단 |
|---|---:|---:|---:|---:|---|
| `/changelog` | 1 | 938 | 0.11% | 7.96 | 검색 의도 확인 및 릴리스 탐색 개선 |
| `/blog/cursor-vs-offset-pagination-prisma` | 1 | 479 | 0.21% | 8.31 | 내용 불일치 수정과 keyset 예제 보강 |
| `/guide/multi-tenant-saas` | 3 | 488 | 0.61% | 16.89 | 긴 문서의 빠른 실행 경로 강화 |
| `/guide/prisma-extension-chaining` | 0 | 181 | 0.00% | 11.10 | 실제 검색어 확인 후 설명·예제 조정 |
| `/packages/audit-log/` | 6 | 248 | 2.42% | 8.36 | 성과 있는 도입 페이지 강화 |
| `/packages/outbox/` | 6 | 143 | 4.20% | 11.09 | 성과 유지, 관련 문서 흐름 점검 |
| `/packages/pagination/` | 5 | 211 | 2.37% | 19.09 | 비교 글과 구현 문서 정합성 개선 |
| `/packages/soft-delete/` | 5 | 192 | 2.60% | 13.20 | 기존 콘텐츠와 도입 경로 강화 |
| `/packages/jobs/` | 2 | 124 | 1.61% | 22.17 | background jobs 선택 기준을 작은 실험으로 보강 |

출처: `페이지!A2:E11`, `페이지!A19:E19`. CTR은 각 페이지의 클릭/노출로 계산 후 표시했다.

상위 네 영문 패키지(audit-log, outbox, pagination, soft-delete)는 **22클릭, 794노출, CTR 2.77%**다. 전체 42클릭의 52.4%를 차지한다. 원본 `페이지!A2:E5` 기준이며 한국어 outbox 페이지는 포함하지 않는다. 이 네 페이지는 작은 표본이지만 실제 클릭이 발생한 도입 경로라는 점에서 보강 가치가 있다.

Changelog와 pagination 비교 글을 합치면 1,417회 노출에 2회 클릭이다. 다만 순위·검색어·국가 구성 차이가 있으므로 패키지 페이지 CTR을 이 두 페이지의 목표값으로 그대로 적용하지 않는다.

## 4. 실행할 개선안

### 우선 1: pagination 비교 글의 정확성과 실용성 개선

확인된 문제는 메타태그 누락이 아니라 **문서 간 추천의 불일치**다.

- [비교 글 72행](/Users/ksy/Documents/GitHub/nestarc.dev/blog/cursor-vs-offset-pagination-prisma.md:72)은 `createdAt`, `name` 등 non-PK 정렬에 Offset만 권한다.
- [패키지 소개](../../packages/pagination/index.md)는 non-unique 정렬에 tie-breaker keyset을 지원한다고 설명한다.
- [벤치마크](../../packages/pagination/benchmark.md)는 keyset 또는 페이지 점프가 필요할 때 Offset을 권한다.

제안 작업:

1. Offset, Prisma의 `cursor` API, 패키지의 composite keyset을 구분하는 선택표를 작성한다. Keyset을 무조건 다른 상위 분류인 것처럼 표현하지 않고 cursor 방식의 구현 차이도 설명한다.
2. `createdAt + id`, 같은 정렬값이 여러 개일 때의 동작, 복합 인덱스, 정렬 방향을 포함한 작동 예제를 추가한다.
3. “Prisma가 no-LIMIT SQL을 생성한다”는 설명은 실제 측정한 버전·쿼리·환경으로 한정하고 쿼리 로그와 EXPLAIN 근거를 연결한다. 이번 조사에서는 벤치마크를 다시 실행하지 않았다.
4. 이미 존재하는 패키지·벤치마크 링크는 유지하고 해당 설명 바로 옆에서 참조하게 한다.
5. 내용 보강 후 제목 실험안은 `Prisma Pagination: Offset vs Cursor vs Keyset`, 설명안은 `Compare offset, Prisma cursor, and keyset pagination with PostgreSQL benchmarks, createdAt tie-breakers, and NestJS examples.`로 검토한다. 실제 보강 내용과 일치할 때 사용한다.

Google은 정확하고 독창적인 근거, 유용한 설명, 내용과 일치하는 제목을 권장한다. 제목·본문 수정은 실험이며 클릭 상승을 보장하지 않는다. [콘텐츠 품질 안내](https://developers.google.com/search/docs/fundamentals/creating-helpful-content), [검색 제목 안내](https://developers.google.com/search/docs/appearance/title-link)

### 우선 2: changelog의 검색 의도 확인과 상단 탐색 개선

`검색어 수!A10:E10`의 `nestjs changelog`는 112노출·0클릭·평균 7.98위다. 프레임워크 자체 릴리스를 찾는 검색일 가능성이 있지만, `/changelog`에 연결되었다는 교차 자료는 없다.

현재 [changelog](../../changelog.md)는 이미 `nestarc Changelog: NestJS Package Releases`라는 제목을 사용한다. 짧은 소개 뒤 tenancy의 긴 버전 이력이 먼저 나온다.

- 먼저 GSC에서 `/changelog` 페이지를 필터링한 뒤 검색어를 확인한다.
- 상단에 패키지별 최신 버전·확인된 발표일·주요 변경·업그레이드 가이드·원본 릴리스 링크를 모은 표와 바로가기를 제공한다.
- 프레임워크 릴리스와의 혼동이 확인되면 `nestarc Package Changelog: Releases & Upgrade Guides`처럼 범위를 더 명확히 하는 제목을 시험한다.
- 낮은 CTR만으로 이 페이지를 삭제하거나 noindex 처리하지 않는다. 관련성이 낮은 노출을 줄이는 것이 목표일 때는 전체 CTR 상승보다 관련 검색 클릭과 도입 경로를 평가한다.

### 우선 3: multi-tenant 가이드의 시작 경로 정리

[가이드](../../guide/multi-tenant-saas.md)는 이미 RLS SQL, 인증 순서, 테스트, 예제 링크를 포함한다. 약 935줄 문서 전체를 새로 만드는 대신 첫 화면에 다음 정보를 모으는 편이 효율적이다.

- 이 가이드가 맞는 사용 사례와 완성 결과.
- 짧은 실행 순서와 검증된 버전 조합.
- 재현 가능한 예제의 고정 tag/commit. 기존 `main` 링크와 전체 튜토리얼 예제의 범위를 구분한다.
- 인증과 멤버십 검증을 포함해 실제 처리 순서와 일치하는 요청 흐름 도식.
- RLS 방식 선택을 고민하는 독자를 위한 비교 글 연결.

평균 16.89위이므로 제목 변경만으로 CTR이 크게 개선된다고 기대하기보다, 검색 질문에 대한 답의 완성도와 구현 가능성을 높이는 작업으로 평가한다.

### 우선 4: 성과 있는 패키지 페이지에서 설치까지의 경로 강화

[audit-log 개요](../../packages/audit-log/index.md)는 지원 조건과 기능 설명이 풍부하다. 기존 상세 글의 `withAuditTransaction()` 예제와 기록 결과를 짧게 가져와 상단의 설치 링크와 연결한다. 원자성 조건이나 호환성 설명을 줄여서 기능을 과장하지 않는다.

pagination은 비교 글의 keyset 개선과 함께 점검한다. outbox와 soft-delete는 성과가 있다는 이유만으로 제목을 전면 교체하지 않고, 실제 검색어와 패키지 설치 경로를 확인한 뒤 필요한 부분만 바꾼다.

### 후속: 수요가 작은 주제는 기존 페이지 안에서 검증

- `nestjs background jobs`: 23노출·1클릭·12.91위 (`검색어 수!A2:E2`). [jobs 개요](../../packages/jobs/index.md)에 이미 backend 비교표와 quickstart가 있다. cron, durable queue, transactional outbox의 선택 기준을 짧게 보강하는 실험부터 한다.
- `prisma-extension-chaining`: 181노출·0클릭이지만 방문 검색어가 불명확하다. 페이지 필터로 실제 질문을 확인한 뒤 기존 확장 순서 설명과 예제를 조정한다.
- [RLS 비교 글](../../blog/rls-vs-application-level-tenancy.md)의 “항상 fail-closed”, “우회 불가” 표는 실행 역할·정책 조건을 가까이 명시해야 한다. PostgreSQL의 superuser, BYPASSRLS, 기본적인 테이블 소유자 우회 예외가 있다. 이 페이지는 12노출·0클릭으로 트래픽 우선순위는 낮지만 정확성 보완의 근거는 분명하다. [PostgreSQL 공식 RLS 문서](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)

## 5. 국가·기기와 투자 방향

- 미국: 2,022노출, 전체의 **51.6%**, 6클릭, CTR 0.30%, 평균 7.66위 (`국가!A2:E2`). 미국·데스크톱·우선 페이지로 좁혀 검색 의도와 노출 제목을 확인할 가치가 있다. 현재 파일로 세 차원을 연결할 수는 없다.
- 데스크톱: 3,630노출, 전체의 **92.6%**, 38클릭, 전체 클릭의 **90.5%** (`기기!A2:E2`). 코드·비교표·설치 경로가 잘 읽히는 문서 경험에 우선 투자할 근거다.
- 한국어 경로: 6페이지 합계 98노출·2클릭. 표본이 작으므로 대규모 번역 확대보다 이미 수요가 있는 영문 콘텐츠 보강을 먼저 제안한다. 한국 시장의 잠재력이 낮다는 뜻은 아니다.

미국 CTR이 낮다는 사실만으로 영어 품질이나 제목이 원인이라고 단정하지 않는다. 모바일의 4클릭 역시 모바일 UX 문제가 없거나 있다는 결론을 내리기에 부족하다.

## 6. 현재 기술 SEO 검증

2026-09-23에 아래 검사를 실행했다.

| 검사 | 확인 결과 |
|---|---|
| `node scripts/validate-live-sitemap.mjs` | 배포 sitemap 192개 URL 모두 리디렉션 없이 2xx, SEO controls 통과 |
| `node scripts/validate-site.mjs` | 기존 빌드의 192개 공개 페이지·193개 HTML 검사 통과. 재빌드는 하지 않음 |
| 언어 연결 | sitemap 영어/한국어 8쌍의 reciprocal en·ko·x-default 확인 |
| 배포 표본 | `/blog/`, `/guide/`의 개선된 제목과 H1, 검토일 JSON-LD 확인 |
| GSC의 `.html` 8개 경로 | 모두 extensionless 경로로 301 또는 308 응답 |

점검한 `.html` 경로는 audit-log 글, pagination 비교 글, multi-tenancy-pitfalls 글, idempotency 글, pagination quickstart, build-vs-buy 글, feature-flag rollout, rbac typed-permissions다. 원본 합계 20노출·0클릭이며 현재 중복 오류로 판정할 근거가 없다.

이미 구현된 canonical, 페이지별 제목·description·OG, 구조화 데이터, robots, sitemap, hreflang, 내부 링크, 레거시 리디렉션을 신규 개선 과제로 반복하지 않는다. `docs/SEO_DIRECTION.md`의 일부 배포 미확인 기록은 현재 라이브 검증 결과와 구분해야 한다.

이번 검사로 Google의 선택 canonical, 실제 색인 제외 원인, Search Console sitemap 제출 상태, Core Web Vitals 현장 성능까지 확인한 것은 아니다. 이런 항목이 문제가 있다고 추정해서 수정하지 않는다.

추가 schema나 `llms.txt` 확대는 이번 Google 검색 클릭 개선의 우선 과제가 아니다. Google은 `llms.txt`가 Google 검색 노출·순위에 영향을 주지 않는다고 안내한다. [Google AI 검색 최적화 안내](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)

## 7. 적용과 측정 순서

| 순서 | 작업 | 완료 기준 |
|---|---|---|
| 1 | GSC에서 우선 4페이지별 검색어와 기간 비교 추출 | 페이지×검색어×기간, 필요 시 미국·데스크톱을 분리한 근거 확보 |
| 2 | pagination 비교 글 정합성 수정 | keyset·동점 정렬·측정 범위·예제 검증 완료 |
| 3 | changelog 탐색 개선 | 최신 버전 표·릴리스 원본·업그레이드 경로 확인 |
| 4 | multi-tenant와 audit-log 도입 경로 개선 | 검증된 버전·예제·설치 이동 경로 확인 |
| 5 | 배포일 기록 후 28일 관찰 | 동일 페이지·쿼리·국가·기기 기준으로 배포 전 28일과 비교 |

페이지별 클릭·노출·CTR·평균 순위와 실제 설치 문서 이동을 함께 평가한다. 원본에는 방문 후 전환 자료가 없으므로 패키지 도입 증가를 현재 실적으로 주장하지 않는다. 가능하다면 설치 문서 방문, GitHub/npm 이동 등 도입 의도 지표를 분석 도구에서 별도 측정한다.

기간 비교에서 순위·쿼리 구성 변화가 큰 경우 CTR 변화를 제목 효과로 귀속하지 않는다. 총 클릭 42회의 작은 표본이므로 여러 페이지 제목을 동시에 자주 바꾸기보다, 우선 페이지를 순차적으로 바꾸고 변경일을 남긴다. 28일은 검토 주기이며 통계적 확실성이나 성과를 보장하는 기간은 아니다.

Google은 검색 설명을 주로 본문에서 만들며 meta description을 항상 그대로 표시하지 않는다. 따라서 description 수정만으로 문제를 해결하려 하지 않고 본문 첫 답변과 제목을 함께 정합화한다. [Google 검색 설명 안내](https://developers.google.com/search/docs/appearance/snippet)

## 8. 2026-09-23 구현 결과

| 개선 항목 | 반영 내용 |
|---|---|
| Pagination 비교 글 | 제목·description·검토일 갱신, offset/Prisma cursor/keyset 선택표, `createdAt + id` 예제와 인덱스·동점·데이터 변경 설명 |
| Pagination 문서 정합성 | 개요→전략 문서→비교 글 연결, 구현 예제 추가, benchmark의 SQL 일반화를 제거하고 쿼리 로그·EXPLAIN 재현 절차 추가 |
| Changelog | npm에서 검증한 13개 패키지의 최신 배포 버전·UTC 날짜, 문서 버전, 관련 변경·업그레이드 링크를 상단 표에 정리 |
| Multi-tenant 가이드 | 사용 대상·완성 범위·버전표·짧은 실행 순서, tenancy 0.16.1 커밋에 고정된 실제 예제, 인증/멤버십 검증을 포함한 흐름 |
| Audit-log 개요 | 원자적 업데이트 예제와 생성되는 diff 설명, 설치·상세 예제·오류 처리 경로 |
| Jobs 개요 | cron/queue/outbox/in-memory의 선택 기준과 기존 실행 문서 연결 |
| Extension chaining | 요구사항별 최소 체인 선택표, 준비 항목과 문서 버전의 명시 |
| Soft-delete·outbox 개요 | 첫 설치·기능별 도입 경로 보강, 문서가 다루는 버전을 최신 npm 버전과 구분 |
| RLS 비교 글 | superuser/BYPASSRLS/owner 예외, FORCE 범위, 역할·정책 전제, 명시적 failClosed 설정, 검토일 갱신 |

새로 조회한 npm 최신 버전은 audit-log 0.6.0, soft-delete 0.7.3, feature-flag 0.6.0, outbox 0.4.0, webhook 0.13.2다. 기존 문서는 각각 0.5.0, 0.7.2, 0.5.0, 0.3.0, 0.13.1을 다룬다. 이번 변경에서는 버전 차이를 노출하고 공개 릴리스 소스가 존재하는지 확인했다. 신규 API에 대한 전체 마이그레이션·API 재생성은 수행하지 않았으며 기존 설명을 새 버전의 지원 증거로 표시하지 않았다.

검증: `npm run docs:check` 통과. 기존 78개 테스트, 13개 generated/documented API 패키지와 90개 Markdown 검증, VitePress 빌드, 193개 공개 페이지·194개 HTML의 링크/앵커·canonical·metadata·구조화 데이터 검사 통과. 기존 작업 중이던 outbox 변경을 보존한 현재 작업 트리 기준이다. 빌드에는 기존 번들 크기 경고가 남아 있다.

브라우저 검증은 로컬 `http://127.0.0.1:4173`에서 Codex 내장 브라우저로 진행했다. Changelog→cursor strategies→pagination 비교 글 이동, 갱신된 제목·검토일·본문 렌더링과 오류/경고 로그 없음을 확인했다. npm 날짜와 새 릴리스 소스 5개, 고정된 tenancy 예제 README도 공개 원본과 대조했다. 데이터베이스 예제나 새로운 성능 측정은 실행하지 않았다.

남은 외부 작업:

- Search Console 페이지×검색어×기간 자료: Chrome 접근이 허용되지 않아 계정 자료를 읽지 못했다. 쿼리 혼동을 확인하기 전이므로 changelog 제목의 추가 실험은 보류했다.
- 배포와 Google 재수집 확인: 로컬 구현 완료이며, 배포 완료로 기록하지 않았다. 실제 배포일 D를 기록한 뒤 GSC PT 기준 D 이전 28일과 D 이후 28일을 동일 필터로 비교한다.
- 설치 문서/GitHub/npm 이동 전환 측정: 연결된 분석 계정이나 측정 ID가 없어 추적 코드를 임의로 추가하지 않았다.
- 후속 순위·CTR: 28일 관측 자료가 쌓인 뒤 평가한다. 이번 작업을 검색 순위 상승 또는 클릭 증가의 완료로 표시하지 않는다.
