---
title: NestJS 멀티테넌시와 PostgreSQL RLS
description: "NestJS에서 @nestarc/tenancy 0.16.4로 PostgreSQL RLS를 적용하고, audit-log가 연 Prisma 트랜잭션에서 삭제·복구와 감사 기록을 함께 처리하는 방법입니다."
---

# NestJS 멀티테넌시와 PostgreSQL RLS

`@nestarc/tenancy` **0.16.4**는 권한을 확인한 테넌트의 ID를 Prisma 트랜잭션에 전달합니다. PostgreSQL은 해당 ID와 RLS 정책에 따라 애플리케이션 역할이 읽거나 변경할 수 있는 행을 결정합니다.

## 0.16.4에서 삭제·복구와 감사 기록을 함께 처리하기

`audit-log@0.7.0`과 `soft-delete@0.7.5`를 함께 쓰면 `withAuditTransaction()`이 트랜잭션을 엽니다. 여기에 새 함수 `tenancyTransactionCallback(tenancyService, work)`를 콜백으로 전달하세요. `work`가 실행되기 전에 같은 연결에 현재 테넌트가 설정됩니다. 감사 기록을 저장하는 데 실패하면 앞서 실행한 업무 변경과 감사 기록도 함께 롤백됩니다.

일반 조회용 클라이언트에는 기존 tenancy 확장을 적용합니다. 감사용 클라이언트는 같은 기본 Prisma 클라이언트에 audit 확장과 soft-delete 확장을 순서대로 적용해 만드세요. 하나의 트랜잭션에서는 권한을 확인한 테넌트 하나만 사용하고, 행을 추가할 때는 테넌트 필드를 명시하세요. [통합 가이드](/guide/prisma-extension-chaining) · [0.16.4 트랜잭션 예제](/packages/tenancy/installation#use-a-transaction-opened-by-audit-log)

## 0.16.2 보안 업데이트

Node.js `^22.23.4 || ^24.22.1`이 필요하며 NestJS 10/11과 Prisma 6/7 지원 범위는 유지됩니다. Node 26 지원은 선언되어 있지 않습니다. 애플리케이션, 컨테이너, 워커가 실제로 실행하는 Node 바이너리를 업데이트하고 프로세스를 재시작해야 합니다. tenancy 패키지 설치만으로 Node에 내장된 Brotli 디코더가 패치되지는 않습니다.

애플리케이션의 `body-parser` 의존성도 1.x는 **1.20.9 이상**, 2.x는 **2.4.0 이상**으로 업데이트하고 `npm ls body-parser --all`로 확인하세요. 각 호출자와 호환되는 major 버전을 유지해야 하며, 소스 저장소의 overrides는 소비자 애플리케이션에 전파되지 않습니다.

`TenantResourceKey`는 빈 문자열이나 ASCII 숫자(`0`–`9`)만으로 된 `separator`를 생성자에서 거부합니다. 기본 `:`와 유효한 구분자는 기존 키 형식을 유지합니다. 영향을 받는 설정은 패키지 업그레이드 전에 모든 reader와 writer를 중지하고, 캐시는 테넌트 권한이 확인된 데이터에서 다시 만들며, 영속 리소스는 별도로 검증한 테넌트 소유권에 따라 이전하세요. 모호한 기존 키를 분리해 소유자를 추정하거나 새 키가 없을 때 이전 키로 fallback해서는 안 됩니다.

0.16.1에서 업데이트할 때 데이터베이스 스키마나 RLS 정책 마이그레이션은 필요하지 않습니다. [0.16.2 업그레이드 순서](/packages/tenancy/migration#upgrade-to-0-16-2)와 [리소스 키 이전 절차](/packages/tenancy/non-http-resources#migrating-tenant-resource-key-separators)를 참고하세요.

## 반드시 확인할 점

- 기본 테넌트 ID 검증은 UUID 형식입니다. 다른 형식이나 존재 확인이 필요하면 `validateTenantId`를 설정합니다.
- `TenancyModule.forRoot()` 등록만으로 Prisma 쿼리가 격리되지는 않습니다. `createPrismaTenancyExtension()`으로 만든 확장 클라이언트를 사용해야 합니다.
- 테이블 소유자 우회를 막아야 한다면 `FORCE ROW LEVEL SECURITY`와 운영 DB 역할을 함께 검토합니다.
- 배치와 큐 작업은 HTTP 요청 밖에서 실행되므로 `TenancyContext.run()`으로 컨텍스트를 명시하고, `missingContext: { policy: 'warn' | 'throw' }`로 누락을 관찰하거나 차단합니다.
- 배포 전후 `npx @nestarc/tenancy check`로 생성 SQL을 검사하고, 실제 애플리케이션 DB 역할로 `npx @nestarc/tenancy doctor`를 실행합니다.
- tenancy가 트랜잭션을 열 때는 `tenancyTransaction()`에 `maxWait`, `timeout`, 격리 수준을 전달할 수 있습니다. audit-log가 열 때는 `withAuditTransaction()`에서 트랜잭션 옵션을 설정합니다.

[전체 설치 문서](/packages/tenancy/installation) · [CLI와 live doctor](/packages/tenancy/cli) · [비HTTP 리소스 보호](/packages/tenancy/non-http-resources) · [PostgreSQL RLS 공식 문서](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)

## 0.16 업그레이드

0.15 이하에서 업그레이드한다면 0.16.0의 변경사항도 적용해야 합니다. 현재 배포에는 0.16.2에서 상향한 Node.js 요구사항을 적용하세요. lifecycle event의 raw `request` 필드는 제거되었으므로 `requestSummary`를 사용합니다. TEXT/UUID tenant 컬럼에 맞춘 정책과 비어 있지 않은 컨텍스트를 요구하는 restrictive RLS guard가 생성됩니다. 기존 배포도 SQL diff와 정책 이름을 검토한 뒤 재적용하고 `check`와 `doctor`로 확인해야 합니다.

RPC에는 명시적인 `TenantIdValidator`를 연결하고 producer 인증과 테넌트 권한도 확인합니다. 0.16.3부터 누락된 컨텍스트의 진단 훅과 tenancy 이벤트 리스너는 비동기 작업의 Promise를 반환하면 거부 사유가 로그에 기록됩니다. `interactiveTransactionSupport`는 0.17에서 제거될 예정입니다. 이 옵션으로 삭제·감사 연동을 구성했다면 0.16.4의 콜백으로 바꿀 수 있습니다. [버전별 마이그레이션](/packages/tenancy/migration#upgrade-to-0-16-4)
