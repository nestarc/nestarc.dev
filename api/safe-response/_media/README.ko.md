# @nestarc/safe-response

NestJS API 응답을 표준화하는 패키지 — 전역 모듈로 성공/에러 엔벨로프와 페이지네이션 메타데이터를 구성하고, 데코레이터로 이에 맞는 Swagger 스키마를 생성합니다.

[English](https://github.com/nestarc/nestjs-safe-response/blob/da906dbed39f90e7d0a3cf51d0e4775059e1db58/README.md)

## 주요 기능

- **자동 응답 래핑** — HTTP 컨트롤러 반환값을 `{ success, statusCode, data }` 구조로 래핑하며 라우트·파일 응답은 제외 가능
- **에러 표준화** — 예외를 `{ success: false, error: { code, message, details } }` 형태로 변환
- **페이지네이션 메타데이터** — 오프셋(`page`/`limit`/`total`) 및 커서(`nextCursor`/`hasMore`) 페이지네이션 자동 계산 + HATEOAS 링크
- **정렬/필터 메타데이터** — `@SortMeta()`, `@FilterMeta()` 데코레이터로 정렬/필터 정보를 응답 `meta`에 포함
- **요청 ID 추적** — 옵션 활성화 시 `requestId` 필드 제공 (수신 헤더 재사용, 자동 생성, 응답 헤더 전파)
- **응답 시간** — `meta.responseTime` (ms) 자동 측정 옵션
- **RFC 9457 Problem Details** — `application/problem+json` 표준 에러 포맷 옵트인
- **필드 선택 (Partial Response)** — Google 스타일 `?fields=id,name` 쿼리 파라미터로 응답 필드 선택, 중첩 필드 dot-notation, 제한 옵션, prototype-safe 경로 처리 지원
- **에러 카탈로그** — `defineErrors()`로 에러 중앙 정의, 타입 지정 `SafeException` 팩토리, 카탈로그 기반 Swagger 에러 데코레이터 제공
- **API 버전 메타데이터** — `meta.apiVersion` 자동 주입 옵트인
- **StreamableFile 자동감지** — `StreamableFile` 반환 시 래핑 자동 스킵 (`@RawResponse()` 불필요)
- **Swagger 연동** — `@ApiSafeResponse(Dto)`로 성공 스키마, `@ApiSafeErrorResponse()` / `@ApiSafeErrorResponses()`로 에러 스키마 — 래핑된 엔벨로프 구조 자동 생성
- **글로벌 에러 Swagger** — `applyGlobalErrors()`로 모든 라우트에 공통 에러(401, 403, 500) 자동 추가
- **프론트엔드 클라이언트 타입** — `@nestarc/safe-response/client`에서 런타임 의존 없는 TypeScript 타입 + 타입 가드 (`isSuccess`, `isError`, `isPaginated`, `isProblemDetailsResponse`, `hasResponseTime`, `hasSort`, `hasFilters`, `isDeprecated`, `hasRateLimit`, `hasFieldSelection`) 제공
- **nestjs-i18n 연동** — 어댑터 패턴으로 에러/성공 메시지 자동 번역
- **API 지원 종료** — `@Deprecated()` 데코레이터로 RFC 9745/8594 `Deprecation`/`Sunset` 헤더, Swagger `deprecated: true`, 응답 `meta.deprecation` 자동 설정
- **속도 제한 메타데이터** — `meta.rateLimit`에 `X-RateLimit-*` 응답 헤더 미러링 옵트인
- **nestjs-cls 연동** — CLS 스토어 값(traceId, correlationId)을 응답 `meta`에 자동 주입
- **class-validator 지원** — 유효성 검증 에러를 `details` 배열로 파싱
- **커스텀 에러 코드** — `errorCodeMapper`로 예외를 머신 리더블 코드에 매핑
- **복합 데코레이터** — `@SafeEndpoint()`, `@SafePaginatedEndpoint()`, `@SafeCursorPaginatedEndpoint()`로 Swagger + 런타임 + 에러 문서를 단일 데코레이터로 결합
- **선언적 에러 코드** — `errorCodes` 옵션으로 매퍼 함수 없이 간단한 상태-코드 매핑
- **형상 불일치 경고** — `@Paginated()`, `@CursorPaginated()`, `@SortMeta()`, `@FilterMeta()` 핸들러 데이터가 예상 형상과 다를 때 경고
- **라우트별 제외** — `@RawResponse()`로 헬스체크, SSE, 파일 다운로드 등 래핑 건너뛰기
- **플랫폼 무관** — Express와 Fastify 어댑터 모두 추가 설정 없이 동작
- **컨텍스트 안전** — HTTP가 아닌 컨텍스트(RPC, WebSocket)에서는 자동으로 래핑 스킵
- **Dynamic Module** — `register()` / `registerAsync()` DI 완전 지원

## 설치

```bash
npm install @nestarc/safe-response
```

### Peer Dependencies

애플리케이션에 맞는 메이저 버전을 선택하고, NestJS HTTP 어댑터도 `@nestjs/core`와 같은 메이저 버전을 사용하세요.

```bash
# NestJS 11 (Node.js >= 20)
npm install @nestjs/common@^11 @nestjs/core@^11 @nestjs/swagger@^11 rxjs@^7 reflect-metadata@^0.2
# NestJS 10 (Node.js >= 18)
npm install @nestjs/common@^10 @nestjs/core@^10 @nestjs/swagger@^8 rxjs@^7 reflect-metadata@^0.2
```

두 조합 중 하나를 선택하세요. `nestjs-i18n`(`^10 || ^11`)과 `nestjs-cls`(`^4 || ^5`)는 해당 연동을 사용할 때만 필요한 선택적 peer 의존성입니다.

## 빠른 시작

```typescript
import { Module } from '@nestjs/common';
import { SafeResponseModule } from '@nestarc/safe-response';

@Module({
  imports: [SafeResponseModule.register()],
})
export class AppModule {}
```

루트 모듈에서 한 번 등록하세요. HTTP 핸들러 반환값을 래핑하고 전역 필터가 처리하는 오류를 표준화합니다. `@RawResponse()`와 `StreamableFile`은 성공 래핑을 건너뛰며, 직접 전송한 응답과 본문 없는 HTTP 응답(예: 204)에는 JSON 엔벨로프가 추가되지 않습니다. 아래 예제에서는 가독성을 위해 선택적 `timestamp`·`path` 필드를 생략하기도 합니다.

### Fastify 사용 시

추가 설정 없이 동일하게 동작합니다:

```typescript
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';

const app = await NestFactory.create<NestFastifyApplication>(
  AppModule,
  new FastifyAdapter(),
);
await app.listen(3000);
```

## 응답 형식

### 성공 응답

```json
{
  "success": true,
  "statusCode": 200,
  "requestId": "550e8400-e29b-41d4-a716-446655440000",
  "data": { "id": 1, "name": "John" },
  "timestamp": "2025-03-21T12:00:00.000Z",
  "path": "/api/users/1"
}
```

> `requestId`는 `requestId` 옵션 활성화 시에만 포함됩니다. [요청 ID](#요청-id) 참고.

핸들러가 `undefined`를 반환하면 JSON에서 `data`가 생략되고, `null`은 `data: null`로 유지됩니다. 타입을 지정하지 않은 Swagger 응답은 생략을 허용하지만 DTO·페이지네이션 데코레이터는 `data`를 필수로 선언합니다. `SafeSuccessResponse<T>`도 `T`에 `undefined`가 포함될 때(`void`, 기본값 `unknown` 포함) 생략을 허용하며, TypeScript `strictNullChecks`를 활성화하면 구체적인 페이로드 타입은 `data`가 필수입니다.

### 에러 응답

```json
{
  "success": false,
  "statusCode": 400,
  "requestId": "550e8400-e29b-41d4-a716-446655440000",
  "error": {
    "code": "BAD_REQUEST",
    "message": "Validation failed",
    "details": ["email must be an email", "name should not be empty"]
  },
  "timestamp": "2025-03-21T12:00:00.000Z",
  "path": "/api/users"
}
```

## 데코레이터

### `@ApiSafeResponse(Model)`

Swagger `data` 필드를 특정 DTO 타입으로 문서화합니다.

```typescript
@Get(':id')
@ApiSafeResponse(UserDto)
async findOne(@Param('id') id: string) {
  return this.usersService.findOne(id);
}
```

옵션: `isArray`, `statusCode`, `description`

### `@ApiPaginatedSafeResponse(Model)`

페이지네이션 포함 Swagger 스키마를 자동 생성합니다.

```typescript
import { BadRequestException, DefaultValuePipe, Get, ParseIntPipe, Query } from '@nestjs/common';

@Get()
@Paginated({ maxLimit: 100 })
@ApiPaginatedSafeResponse(UserDto)
async findAll(
  @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  @Query('limit', new DefaultValuePipe(20), ParseIntPipe) requestedLimit: number,
) {
  if (page < 1 || requestedLimit < 1) throw new BadRequestException('page and limit must be positive');
  const limit = Math.min(requestedLimit, 100);
  const [items, total] = await this.usersService.findAndCount({
    skip: (page - 1) * limit,
    take: limit,
  });
  return { data: items, total, page, limit };
}
```

응답:

```json
{
  "success": true,
  "statusCode": 200,
  "data": [{ "id": 1 }, { "id": 2 }],
  "meta": {
    "pagination": {
      "type": "offset",
      "page": 1,
      "limit": 20,
      "total": 100,
      "totalPages": 5,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

### `@ApiCursorPaginatedSafeResponse(Model)`

커서 기반 페이지네이션 포함 Swagger 스키마를 자동 생성합니다.

```typescript
import { BadRequestException, DefaultValuePipe, Get, ParseIntPipe, Query } from '@nestjs/common';

@Get()
@CursorPaginated({ maxLimit: 100 })
@ApiCursorPaginatedSafeResponse(UserDto)
async findAll(
  @Query('cursor') cursor: string | undefined,
  @Query('limit', new DefaultValuePipe(20), ParseIntPipe) requestedLimit: number,
) {
  if (requestedLimit < 1) throw new BadRequestException('limit must be positive');
  const limit = Math.min(requestedLimit, 100);
  const { items, nextCursor, hasMore, totalCount } =
    await this.usersService.findWithCursor({ cursor, limit });
  return { data: items, nextCursor, hasMore, limit, totalCount };
}
```

응답:

```json
{
  "success": true,
  "statusCode": 200,
  "data": [{ "id": 1 }, { "id": 2 }],
  "meta": {
    "pagination": {
      "type": "cursor",
      "nextCursor": "eyJpZCI6MTAwfQ==",
      "previousCursor": null,
      "hasMore": true,
      "limit": 20,
      "totalCount": 150
    }
  }
}
```

핸들러는 `CursorPaginatedResult<T>`를 반환해야 합니다:

```typescript
interface CursorPaginatedResult<T> {
  data: T[];
  nextCursor: string | null;
  previousCursor?: string | null;  // 기본값: null
  hasMore: boolean;
  limit: number;
  totalCount?: number;             // 선택사항
}
```

### `@ApiSafeErrorResponse(status, options?)`

에러 응답을 `SafeErrorResponseDto` 엔벨로프로 Swagger에 문서화합니다. 에러 코드는 `DEFAULT_ERROR_CODE_MAP`에서 자동 해석됩니다.

```typescript
@Get(':id')
@ApiSafeResponse(UserDto)
@ApiSafeErrorResponse(404)
@ApiSafeErrorResponse(400, {
  code: 'VALIDATION_ERROR',
  message: '입력값 검증 실패',
  details: ['email must be an email'],
})
async findOne(@Param('id') id: string) {
  return this.usersService.findOne(id);
}
```

옵션: `description`, `code`, `message`, `details`

> **참고:** 이 데코레이터는 Swagger 메타데이터만 생성합니다. 모듈의 `errorCodes`를 읽거나 `errorCodeMapper`를 실행하지 않으므로 `code` 옵션을 명시하여 런타임 매핑과 일치시키세요.

`details` 필드 스키마는 예시값에서 자동 추론됩니다:
- 배열 → `{ type: 'array', items: { type } }` (첫 번째 요소에서 item 타입 추론: object, number, 또는 string)
- `object` → `{ type: 'object' }`
- `string` → `{ type: 'string' }`

### `@ApiSafeErrorResponses(configs)`

여러 에러 응답을 한 번에 문서화합니다. 상태 코드 배열 또는 설정 객체 배열을 받습니다.

```typescript
@Post()
@ApiSafeResponse(UserDto, { statusCode: 201 })
@ApiSafeErrorResponses([400, 401, 409])
async create(@Body() dto: CreateUserDto) {
  return this.usersService.create(dto);
}

// 혼합 설정
@Post('register')
@ApiSafeErrorResponses([
  400,
  { status: 401, description: '토큰 만료' },
  { status: 409, code: 'EMAIL_TAKEN', message: '이미 등록된 이메일' },
])
async register(@Body() dto: RegisterDto) {
  return this.authService.register(dto);
}
```

### `@ApiSafeCatalogError(catalog, key)` / `@ApiSafeCatalogErrors(catalog, keys)`

`defineErrors()` 카탈로그에서 에러 응답 문서를 바로 생성합니다. 에러 `code`
예시는 카탈로그 키를 사용하고, status, message, description, details는
카탈로그 정의에서 가져옵니다. 필요하면 호출 시 옵션으로 오버라이드할 수 있습니다.

```typescript
const errors = defineErrors({
  USER_NOT_FOUND: {
    status: 404,
    message: 'User not found',
    description: '요청한 사용자가 없습니다',
  },
  EMAIL_TAKEN: { status: 409, message: '이미 등록된 이메일' },
});

@Get(':id')
@ApiSafeResponse(UserDto)
@ApiSafeCatalogError(errors, 'USER_NOT_FOUND')
findOne() { ... }

@Post()
@ApiSafeCatalogErrors(errors, ['USER_NOT_FOUND', 'EMAIL_TAKEN'])
create() { ... }
```

### `@RawResponse()`

해당 라우트의 응답 래핑을 건너뜁니다.

```typescript
@Get('health')
@RawResponse()
healthCheck() {
  return { status: 'ok' };
}
```

바이너리 응답은 `@nestjs/common`의 `new StreamableFile(bufferOrStream)`을 반환하세요. Express와 Fastify에서 자동으로 래핑을 건너뜁니다. `@RawResponse()`는 이 패키지의 성공 인터셉터만 비활성화하므로 원시 `Buffer`나 스트림의 어댑터 간 호환성을 보장하지 않습니다. 예외는 계속 전역 예외 필터가 처리합니다.

### `@ResponseMessage(message)`

`meta.message`에 커스텀 메시지를 추가합니다.

```typescript
@Post()
@ResponseMessage('User created successfully')
create(@Body() dto: CreateUserDto) {
  return this.usersService.create(dto);
}
```

### `@SafeResponse(options?)`

기본 Swagger 엔벨로프를 문서화합니다. 런타임 래핑은 이 데코레이터가 아니라 `SafeResponseModule`이 수행합니다. 옵션: `description`, `statusCode`.

Swagger의 `statusCode` 옵션은 응답을 문서화하며, 실제 HTTP 상태 변경에는 NestJS `@HttpCode()` 또는 어댑터의 passthrough 응답 API를 사용합니다.

### `@Paginated(options?)`

오프셋 페이지네이션 메타데이터 자동 계산을 활성화합니다. 옵션: `maxLimit`, `links`.

페이지네이션 필드는 숫자로 반환하고 쿼리 파라미터에는 `ParseIntPipe`를 사용하세요. `maxLimit`은 응답 메타데이터만 제한하므로 위 예제처럼 서비스 조회 전에 값을 검증하고 상한을 적용해야 합니다. 데코레이터는 반환 배열을 자르지 않습니다. 커서 페이지네이션에도 같은 규칙이 적용됩니다.

```typescript
@Get()
@Paginated({ maxLimit: 100, links: true })  // HATEOAS 네비게이션 링크
findAll() { ... }
```

`links: true` 설정 시 `meta.pagination.links`에 네비게이션 링크가 자동 생성됩니다:

```json
{
  "meta": {
    "pagination": {
      "type": "offset",
      "page": 2, "limit": 20, "total": 100, "totalPages": 5,
      "links": {
        "self": "/api/users?page=2&limit=20",
        "first": "/api/users?page=1&limit=20",
        "prev": "/api/users?page=1&limit=20",
        "next": "/api/users?page=3&limit=20",
        "last": "/api/users?page=5&limit=20"
      }
    }
  }
}
```

### `@CursorPaginated(options?)`

커서 기반 페이지네이션 메타데이터 자동 계산을 활성화합니다. 옵션: `maxLimit`, `links`.

### `@ProblemType(typeUri: string)`

RFC 9457 문제 유형 URI를 라우트별로 설정합니다. `problemDetails` 활성화 시 사용됩니다.

```typescript
@Get(':id')
@ProblemType('https://api.example.com/problems/user-not-found')
findOne(@Param('id') id: string) { ... }
```

### `@SuccessCode(code: string)`

해당 라우트에 커스텀 성공 코드를 설정합니다 (메서드 레벨 전용). `successCodeMapper` 모듈 옵션보다 우선합니다.

```typescript
@Get()
@SuccessCode('FETCH_SUCCESS')
findAll() {
  return this.usersService.findAll();
}
```

응답:

```json
{
  "success": true,
  "statusCode": 200,
  "code": "FETCH_SUCCESS",
  "data": [{ "id": 1, "name": "John" }]
}
```

### `@SortMeta()` / `@FilterMeta()`

정렬 및 필터 메타데이터를 응답에 포함합니다. 핸들러가 `sort`, `filters` 필드를 데이터와 함께 반환해야 합니다.

```typescript
@Get()
@Paginated()
@SortMeta()
@FilterMeta()
@ApiPaginatedSafeResponse(UserDto)
async findAll(
  @Query('sortBy') sortBy = 'createdAt',
  @Query('order') order: 'asc' | 'desc' = 'desc',
  @Query('status') status?: string,
) {
  const [items, total] = await this.usersService.findAndCount({ sortBy, order, status });
  return {
    data: items, total, page: 1, limit: 20,
    sort: { field: sortBy, order },
    filters: { ...(status && { status }) },
  };
}
```

응답:

```json
{
  "success": true,
  "statusCode": 200,
  "data": [{ "id": 1, "name": "John" }],
  "meta": {
    "pagination": { "type": "offset", "page": 1, "limit": 20, "total": 100, "totalPages": 5, "hasNext": true, "hasPrev": false },
    "sort": { "field": "createdAt", "order": "desc" },
    "filters": { "status": "active" }
  }
}
```

### `@Deprecated(options?)`

엔드포인트를 지원 종료로 표시합니다. deprecation 헤더와 Swagger `deprecated: true`를 설정합니다.

옵션: `since`, `sunset`, `message`, `link`

### `@SkipGlobalErrors()`

`applyGlobalErrors()` 글로벌 에러 주입에서 해당 라우트를 제외합니다.

### 복합 데코레이터

Swagger 문서, 런타임 동작, 에러 응답을 하나의 데코레이터로 결합합니다.

#### `@SafeEndpoint(Model, options?)`

```typescript
@Get()
@SafeEndpoint(UserDto, {
  isArray: true,
  description: 'List users',
  errors: [401, { status: 404, code: 'USER_NOT_FOUND' }],
  message: 'Users fetched',
})
findAll() { ... }
```

`@ApiSafeResponse()` + `@ResponseMessage()` + `@ApiSafeErrorResponses()` 스택과 동일합니다.

옵션: `statusCode`, `isArray`, `description`, `sort`, `filter`, `message`, `code`, `errors`, `deprecated`, `fieldSelection`, `problemDetails`, `errorFormat`

#### `@SafePaginatedEndpoint(Model, options?)`

```typescript
@Get()
@SafePaginatedEndpoint(UserDto, {
  maxLimit: 100,
  links: true,
  errors: [401],
})
findAll() { ... }
```

`@ApiPaginatedSafeResponse()` + `@Paginated()` + `@ApiSafeErrorResponses()` 스택과 동일합니다.

옵션: `maxLimit`, `links`, `sort`, `filter`, `description`, `message`, `code`, `errors`, `deprecated`, `fieldSelection`, `problemDetails`, `errorFormat`

#### `@SafeCursorPaginatedEndpoint(Model, options?)`

```typescript
@Get()
@SafeCursorPaginatedEndpoint(UserDto, {
  maxLimit: 50,
  errors: [401],
})
findAll() { ... }
```

`@ApiCursorPaginatedSafeResponse()` + `@CursorPaginated()` + `@ApiSafeErrorResponses()` 스택과 동일합니다.

옵션: `maxLimit`, `links`, `sort`, `filter`, `description`, `message`, `code`, `errors`, `deprecated`, `fieldSelection`, `problemDetails`, `errorFormat`

> **`problemDetails` 옵션**: `true`이면 에러 응답이 Swagger에서 `application/problem+json` 스키마를 사용합니다. 모듈 레벨 `problemDetails` 설정과 일치시켜야 합니다 — 이 옵션은 Swagger 문서만 제어하며 런타임 동작에는 영향을 주지 않습니다.
>
> **`errorFormat` 옵션**: 새 복합 데코레이터 코드에서는 `errorFormat: 'problem' | 'safe'` 사용을 권장합니다. 의도한 에러 문서 포맷을 명확히 표현하며, `problemDetails`와 함께 제공되면 `errorFormat`이 우선합니다.

## 글로벌 에러 Swagger 문서화

모든 OpenAPI 엔드포인트에 공통 에러 응답(401, 403, 500 등)을 한 번에 주입합니다.

```typescript
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { applyGlobalErrors, SafeResponseModule, SafeResponseModuleOptions } from '@nestarc/safe-response';

// 1. 루트 모듈과 Swagger 초기화에서 같은 옵션 사용
const moduleOptions: SafeResponseModuleOptions = {
  swagger: { globalErrors: [401, 403, { status: 500, message: '서버 오류' }] },
};
// AppModule의 imports에서 등록:
SafeResponseModule.register(moduleOptions);

// 2. 문서 생성 후 적용
const config = new DocumentBuilder().setTitle('My API').build();
const document = SwaggerModule.createDocument(app, config);
applyGlobalErrors(document, moduleOptions);  // document를 직접 변경
SwaggerModule.setup('api', app, document);
```

`swagger` 모듈 옵션만으로 문서가 변경되지는 않으므로 `applyGlobalErrors()`를 명시적으로 호출해야 합니다. 같은 상태 코드에 이미 정의된 응답은 유지합니다. `@SkipGlobalErrors()`로 특정 라우트를 제외할 수 있습니다.

## 요청 ID

모든 응답에 고유 식별자를 포함하여 프로덕션 디버깅과 분산 추적에 활용합니다.

```typescript
SafeResponseModule.register({
  requestId: true, // UUID v4 자동 생성, X-Request-Id 헤더 재사용
})
```

동작 방식:
1. 수신 `X-Request-Id`의 첫 값을 128자로 자르고 `A–Z`, `a–z`, `0–9`, `-`, `_`, `.`, `~` 이외의 문자를 제거
2. 사용할 값이 없으면 설정된 생성기 또는 `crypto.randomUUID()` 사용; 생성기 결과도 정제하며 빈 값이나 예외 발생 시 UUID로 폴백
3. 성공/에러 응답 모두에 `requestId` 필드 포함
4. `X-Request-Id` 응답 헤더 설정 (하류 추적용)

### 커스텀 옵션

```typescript
SafeResponseModule.register({
  requestId: {
    headerName: 'X-Correlation-Id',  // 커스텀 헤더명 (기본값: 'X-Request-Id')
    generator: () => `req-${Date.now()}`,  // 커스텀 ID 생성기
  },
})
```

## 응답 시간

이 인터셉터부터 응답 생성까지의 경과 시간을 측정합니다. 이후 실행되는 파이프·인터셉터·핸들러는 포함하고, 앞서 실행된 Guard와 네트워크 전송 시간은 제외합니다.

```typescript
SafeResponseModule.register({
  responseTime: true,  // 측정 가능한 경우 meta.responseTime (밀리초) 포함
})
```

응답:

```json
{
  "success": true,
  "statusCode": 200,
  "data": { "id": 1, "name": "John" },
  "meta": { "responseTime": 42 }
}
```

`performance.now()`로 측정합니다. 성공 응답과 인터셉터 실행 이후 발생한 오류 응답에 포함되며, 앞서 Guard 등에서 발생한 오류에는 포함되지 않습니다.

## RFC 9457 Problem Details

[RFC 9457](https://www.rfc-editor.org/rfc/rfc9457.html) Problem Details 에러 응답을 활성화합니다.

```typescript
SafeResponseModule.register({
  problemDetails: { baseUrl: 'https://api.example.com/problems' },
  requestId: true,
})
```

`X-Request-Id: abc-123` 헤더를 보낸 요청에서 `new NotFoundException('ID 123 사용자를 찾을 수 없습니다')`를 던진 경우:

```json
{
  "type": "https://api.example.com/problems/not-found",
  "title": "Not Found",
  "status": 404,
  "detail": "ID 123 사용자를 찾을 수 없습니다",
  "instance": "/api/users/123",
  "code": "NOT_FOUND",
  "requestId": "abc-123"
}
```

- `Content-Type: application/problem+json` 자동 설정
- `problemDetails: true`이고 `@ProblemType()`이 없으면 `type`은 `about:blank`
- `@ProblemType(uri)` 데코레이터로 라우트별 type URI 지정, 또는 `baseUrl` + 에러 코드로 자동 생성
- 확장 멤버 유지: `code`, `requestId`, `details` (유효성 검사 에러), `meta.responseTime`
- 성공 응답에는 **영향 없음** — 에러 응답만 포맷 변경
- Swagger 문서화: `@ApiSafeProblemResponse(status, { description, code, message, details })` 사용; 옵션 객체는 생략 가능

## 프론트엔드 클라이언트 타입

공개 패키지 import는 TypeScript의 `node`, `nodenext`, `bundler` 모듈 해석을 지원합니다. `/client` 선언에 레거시 `node` 해석용 `typesVersions` 매핑을 추가했으며, CJS·ESM은 기존 `exports` 맵을 사용합니다.

0.16.0에서 `SafeSuccessResponse<T>`는 조건부 type alias로 변경되었습니다. 기존 제네릭 interface 확장이나 선언 병합 대신 `type AppSuccess<T> = SafeSuccessResponse<T> & { traceId: string }`처럼 교차 타입을 사용하세요.

`@nestarc/safe-response/client`는 NestJS, Swagger, `reflect-metadata`를 런타임에 import하지 않습니다. 다만 npm 패키지에는 서버 peer 의존성이 선언되어 있으므로 `/client`만 사용하는 앱에서도 패키지 관리자가 해당 의존성을 설치하거나 요구할 수 있습니다.

```typescript
import type { SafeAnyResponse } from '@nestarc/safe-response/client';
import {
  isSuccess, isError, isPaginated, isOffsetPagination, isCursorPagination,
  isProblemDetailsResponse, hasResponseTime, hasSort, hasFilters,
  isDeprecated, hasRateLimit, hasFieldSelection,
} from '@nestarc/safe-response/client';

// SafeAnyResponse는 성공, 에러, Problem Details 응답을 모두 포함합니다
const res: SafeAnyResponse<User[]> = await fetch('/api/users').then(r => r.json());

if (isSuccess(res)) {
  console.log(res.data);  // User[]

  if (isPaginated(res.meta) && isOffsetPagination(res.meta.pagination)) {
    console.log(`${res.meta.pagination.page} / ${res.meta.pagination.totalPages} 페이지`);
  }
}

if (isError(res)) {
  console.error(res.error.code, res.error.message);
}

// RFC 9457 Problem Details (일반 에러와 다른 shape)
if (isProblemDetailsResponse(res)) {
  console.error(res.type, res.detail, res.instance);
}

if (isSuccess(res) && hasFieldSelection(res.meta)) {
  console.log(res.meta.fields);
}
```

## 국제화 (i18n)

`nestjs-i18n` 또는 커스텀 어댑터를 통해 에러 메시지와 `@ResponseMessage()` 값을 자동 번역합니다.

```typescript
// nestjs-i18n 설치 및 앱의 I18nModule 설정 필요
SafeResponseModule.register({ i18n: true });

// 또는 커스텀 어댑터 제공
SafeResponseModule.register({
  i18n: {
    translate: (key, opts) => myTranslator.t(key, opts?.lang),
    resolveLanguage: (request) => {
      const req = request as { headers?: Record<string, string | string[] | undefined> };
      const header = req.headers?.['accept-language'];
      return typeof header === 'string' ? header.split(',')[0].split(';')[0].trim() || 'en' : 'en';
    },
  },
});
```

`i18n: true`는 설정된 `I18nService`를 조회하므로 선택적 peer 설치만으로는 활성화되지 않습니다. 커스텀 어댑터는 `nestjs-i18n` 없이 사용할 수 있습니다. `translate()`나 `resolveLanguage()`가 예외를 던지면 원본 메시지로 폴백합니다.

## 컨텍스트 주입 (nestjs-cls)

요청 범위 컨텍스트 값(traceId, correlationId 등)을 응답 `meta`에 주입합니다. [nestjs-cls](https://www.npmjs.com/package/nestjs-cls), 설정된 `ClsModule`, 해당 미들웨어·Guard·인터셉터가 생성한 활성 CLS 컨텍스트가 필요합니다. 이 옵션을 사용하기 전에 앱에서 peer 설치와 초기화를 완료하세요.

```typescript
SafeResponseModule.register({
  context: {
    // CLS 스토어 키를 응답 meta 필드로 매핑
    fields: { traceId: 'traceId', correlationId: 'correlationId' },
  },
});

// 또는 커스텀 리졸버로 완전 제어
SafeResponseModule.register({
  context: {
    resolver: (store) => {
      const clsService = store as { get(key: string): unknown };
      return { traceId: clsService.get('traceId'), region: clsService.get('region') };
    },
  },
});
```

응답:

```json
{
  "success": true,
  "statusCode": 200,
  "data": { "id": 1, "name": "John" },
  "meta": { "traceId": "abc-123", "correlationId": "req-456" }
}
```

## API 지원 종료 (Deprecation)

엔드포인트를 표준 HTTP 헤더와 응답 메타데이터로 지원 종료 표시합니다.

```typescript
@Get('v1/users')
@Deprecated({
  since: '2026-01-01',           // RFC 9745 Deprecation 헤더
  sunset: '2026-12-31',          // RFC 8594 Sunset 헤더
  message: 'Use /v2/users instead',
  link: '/v2/users',             // Link 헤더 (rel="successor-version")
})
findAll() { ... }
```

자동 설정되는 헤더:
- `Deprecation: @1767225600` (유효한 `since`의 Unix 초 값이며, 없거나 잘못된 날짜이면 현재 시각)
- `Sunset: Thu, 31 Dec 2026 00:00:00 GMT`
- `Link: </v2/users>; rel="successor-version"`

응답에 `meta.deprecation` 포함:

```json
{
  "success": true,
  "statusCode": 200,
  "data": [{ "id": 1, "name": "John" }],
  "meta": {
    "deprecation": {
      "deprecated": true,
      "since": "2026-01-01T00:00:00.000Z",
      "sunset": "2026-12-31T00:00:00.000Z",
      "message": "Use /v2/users instead",
      "link": "/v2/users"
    }
  }
}
```

Swagger에서 자동으로 해당 엔드포인트를 deprecated로 표시합니다. 성공/에러 응답 모두에서 동작합니다.

`since`가 없거나 잘못된 값이면 `Deprecation` 헤더에 해당 응답의 최초 처리 시각을 재사용합니다. `meta.deprecation.since`는 유효한 날짜를 명시한 경우에만 포함합니다. 핸들러가 예외를 던져도 successor 링크는 한 번만 추가됩니다.

> **참고:** Guard가 인터셉터 실행 전에 예외를 던지면 (예: `AuthGuard`가 401 반환), 에러 응답에 deprecation 헤더가 포함되지 않습니다. 이는 `@ProblemType()`과 동일한 제약입니다.

## 속도 제한 메타데이터

속도 제한 응답 헤더를 응답 본문에 미러링하여 프론트엔드에서 활용할 수 있게 합니다.

```typescript
SafeResponseModule.register({
  rateLimit: true,  // X-RateLimit-* 헤더 읽기
})
```

엔벨로프 생성 시 앱 응답에 이미 설정된 헤더를 읽습니다. 예를 들어 속도 제한 Guard나 미들웨어가 설정한 값은 읽을 수 있지만, 프록시나 API 게이트웨이가 나중에 추가한 헤더는 미러링할 수 없습니다:

```json
{
  "success": true,
  "statusCode": 200,
  "data": [{ "id": 1, "name": "John" }],
  "meta": {
    "rateLimit": {
      "limit": 100,
      "remaining": 87,
      "reset": 1712025600
    }
  }
}
```

세 개의 헤더(`Limit`, `Remaining`, `Reset`)가 모두 유한한 음이 아닌 숫자여야 하며, 누락되거나 잘못된 값이면 생략됩니다. 유효한 숫자 `Retry-After`는 `retryAfter`에 포함합니다. 성공/에러 응답 모두에서 사용 가능합니다 (429 Too Many Requests 포함).

### 커스텀 헤더 접두사

```typescript
SafeResponseModule.register({
  rateLimit: { headerPrefix: 'RateLimit' },  // RateLimit-Limit, RateLimit-Remaining, RateLimit-Reset 읽기
})
```

## 필드 선택 (Partial Response)

Google 스타일 `?fields=id,name` 쿼리 파라미터로 응답 데이터에서 특정 필드만 선택합니다.

```typescript
// 라우트별: 데코레이터
@Get(':id')
@FieldSelection()
@ApiSafeResponse(PartialUserDto)
findOne(@Param('id') id: string) {
  return this.usersService.findOne(id);
}

// 전역: 모듈 옵션
SafeResponseModule.register({
  fieldSelection: true,  // 모든 라우트에서 활성화
})
```

요청: `GET /api/users/1?fields=id,name,address.city`

응답:

```json
{
  "success": true,
  "statusCode": 200,
  "data": { "id": 1, "name": "John", "address": { "city": "Seoul" } },
  "meta": { "fields": ["id", "name", "address.city"] }
}
```

- 중첩 필드 dot-notation 지원 (`address.city`)
- 배열: 각 요소에 적용
- 최상위 중첩 배열은 형태를 유지하며 각 요소에 재귀적으로 필드 선택을 적용; 객체 속성 안의 배열은 `addresses.city` 같은 경로로 자동 순회하지 않음
- 존재하지 않는 필드: 자동 무시
- 상속/prototype 경로와 예약 세그먼트(`__proto__`, `prototype`, `constructor`)는 무시
- 데코레이터가 모듈 옵션보다 우선; `@FieldSelection(false)`로 특정 라우트 비활성화

필드 선택은 Swagger 스키마를 변경하지 않습니다. 중첩 속성까지 선택적으로 정의한 `PartialUserDto`나 필드 생략을 허용하는 응답 스키마를 사용하세요. 필수 속성이 있는 DTO를 그대로 사용하면 선택된 응답이 문서의 계약을 위반할 수 있습니다. 이 기능은 출력 필드를 선택하며, 권한 검사나 민감 필드 제외를 대신하지 않습니다.

### 커스텀 옵션

```typescript
@FieldSelection({
  queryParam: 'select',   // 파라미터명 (기본: 'fields')
  separator: ';',          // 구분자 (기본: ',')
  maxDepth: 2,             // 중첩 깊이 제한 (기본: 3)
  maxFields: 20,           // 허용할 필드 경로 수 제한
  maxFieldLength: 80,      // 너무 긴 필드 경로 제거
})
```

부모 필드를 선택하면 자식 경로도 함께 요청하더라도 부모의 전체 값이 포함됩니다 (예: `fields=address,address.city`). 필드 선택은 원본 데이터를 변경하지 않으며 frozen 객체도 지원합니다.

## 에러 카탈로그

에러를 중앙에서 정의하고 키로 throw — 흩어진 상태 코드와 메시지를 제거합니다.

```typescript
import {
  defineErrors,
  createSafeException,
  SafeException,
  SafeResponseModule,
} from '@nestarc/safe-response';

// 1. 에러 정의
const errors = defineErrors({
  USER_NOT_FOUND: { status: 404, message: 'User not found' },
  EMAIL_TAKEN: { status: 409, message: 'Email already registered' },
  VALIDATION_ERROR: { status: 400, message: 'Validation failed', details: ['field is required'] },
});

// 2. 등록
SafeResponseModule.register({ errorCatalog: errors });

// 3. 키로 throw
throw new SafeException('USER_NOT_FOUND');
// → { success: false, statusCode: 404, error: { code: 'USER_NOT_FOUND', message: 'User not found' } }

// throw 시 메시지나 details 오버라이드
throw new SafeException('USER_NOT_FOUND', { message: '프로필을 찾을 수 없습니다' });
throw new SafeException('VALIDATION_ERROR', { details: ['email이 유효하지 않습니다'] });

// 선택사항: 카탈로그 키를 컴파일 타임에 제한하는 typed exception factory
const CatalogException = createSafeException(errors);
throw new CatalogException('EMAIL_TAKEN');
```

에러 코드 해석 순서: `SafeException.errorKey` > `errorCodeMapper` > `errorCodes` > `DEFAULT_ERROR_CODE_MAP` > `'INTERNAL_SERVER_ERROR'`

## API 버전 메타데이터

모든 응답에 API 버전을 포함합니다.

```typescript
SafeResponseModule.register({
  version: '2.1.0',
})
```

응답:

```json
{
  "success": true,
  "statusCode": 200,
  "data": { "id": 1, "name": "John" },
  "meta": { "apiVersion": "2.1.0" }
}
```

성공/에러 응답 모두에 포함됩니다 (표준 및 Problem Details 형식).

## 모듈 옵션

```typescript
SafeResponseModule.register({
  timestamp: true,         // timestamp 필드 포함 (기본값: true)
  path: true,              // path 필드 포함 (기본값: true)
  requestId: true,         // 요청 ID 추적 활성화 (기본값: false)
  responseTime: true,      // 응답 시간 메타 포함 (기본값: false)
  problemDetails: true,    // RFC 9457 에러 포맷 (기본값: false)
  errorCodeMapper: (exception) => {
    if (exception instanceof TokenExpiredError) return 'TOKEN_EXPIRED';
    return undefined;      // 기본 매핑 사용
  },
  dateFormatter: () => new Date().toISOString(),  // 커스텀 날짜 포맷
})
```

### 비동기 등록

```typescript
SafeResponseModule.registerAsync({
  imports: [ConfigModule],
  useFactory: (config: ConfigService) => ({
    timestamp: config.get('RESPONSE_TIMESTAMP', true),
  }),
  inject: [ConfigService],
})
```

### 추가 옵션

| 옵션 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `requestId` | `boolean \| RequestIdOptions` | `undefined` | 응답에 요청 ID 추적 활성화 |
| `responseTime` | `boolean` | `false` | `meta.responseTime` (ms) 포함 |
| `problemDetails` | `boolean \| ProblemDetailsOptions` | `false` | RFC 9457 Problem Details 에러 포맷 활성화 |
| `successCodeMapper` | `(statusCode: number) => string \| undefined` | `undefined` | HTTP 상태 코드를 성공 코드 문자열에 매핑 |
| `transformResponse` | `(data: unknown) => unknown` | `undefined` | 응답 래핑 전 데이터 변환 (동기 함수만 지원) |
| `swagger` | `SwaggerOptions` | `undefined` | Swagger 문서 옵션 (예: `globalErrors`로 모든 라우트에 공통 에러 추가) |
| `context` | `ContextOptions` | `undefined` | CLS 스토어 값(traceId 등)을 응답 `meta`에 주입. `nestjs-cls` 필요. |
| `rateLimit` | `boolean \| RateLimitOptions` | `undefined` | 속도 제한 응답 헤더를 `meta.rateLimit`에 미러링 |
| `i18n` | `boolean \| I18nAdapter` | `undefined` | 에러/성공 메시지 다국어 지원. `true`는 `nestjs-i18n` 자동 감지, 또는 커스텀 어댑터 전달. |
| `errorCodes` | `Record<number, string>` | `undefined` | `DEFAULT_ERROR_CODE_MAP` 위에 병합되는 선언적 에러 코드 맵 |
| `suppressWarnings` | `boolean` | `false` | `@Paginated`, `@CursorPaginated`, `@SortMeta`, `@FilterMeta` 형상 불일치 경고 억제 |
| `version` | `string` | `undefined` | 모든 응답의 `meta.apiVersion`에 포함되는 API 버전 문자열 |
| `errorCatalog` | `ErrorCatalog` | `undefined` | `defineErrors()`로 생성한 중앙 에러 정의. `SafeException`에서 status/message 해석에 사용 |
| `fieldSelection` | `boolean \| FieldSelectionOptions` | `undefined` | `?fields=` 쿼리 파라미터로 모든 라우트에서 부분 응답 활성화 |

#### 성공 코드 매핑

```typescript
SafeResponseModule.register({
  successCodeMapper: (statusCode) => {
    const map: Record<number, string> = { 200: 'OK', 201: 'CREATED' };
    return map[statusCode];
  },
})
```

#### 응답 변환

```typescript
SafeResponseModule.register({
  transformResponse: (data) => {
    if (data && typeof data === 'object' && 'password' in data) {
      const { password, ...rest } = data as Record<string, unknown>;
      return rest;
    }
    return data;
  },
})
```

## `@Exclude()` 연동

### `class-transformer`와 함께 사용

DTO 인스턴스를 반환할 때 NestJS의 `ClassSerializerInterceptor`와 함께 사용할 수 있습니다. Express·Fastify E2E에서 두 모듈 import 순서 모두 `@Exclude()`가 비밀번호를 제거하는지 검증합니다. 일반적인 등록 예시는 다음과 같습니다.

```typescript
import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [SafeResponseModule.register()],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: ClassSerializerInterceptor },
  ],
})
export class AppModule {}
```

## 기본 에러 코드 매핑

| HTTP 상태 | 에러 코드 |
|-----------|-----------|
| 400 | `BAD_REQUEST` |
| 401 | `UNAUTHORIZED` |
| 403 | `FORBIDDEN` |
| 404 | `NOT_FOUND` |
| 405 | `METHOD_NOT_ALLOWED` |
| 409 | `CONFLICT` |
| 413 | `PAYLOAD_TOO_LARGE` |
| 422 | `UNPROCESSABLE_ENTITY` |
| 429 | `TOO_MANY_REQUESTS` |
| 500 | `INTERNAL_SERVER_ERROR` |
| 502 | `BAD_GATEWAY` |
| 503 | `SERVICE_UNAVAILABLE` |

`errorCodeMapper`로 재정의할 수 있습니다. 선택적 두 번째 인자는 `{ statusCode, defaultCode }`를 제공하며, `undefined`를 반환하면 선언적/기본 매핑을 유지합니다.

### 선언적 에러 코드

매퍼 함수 없이 간단한 상태-코드 매핑:

```typescript
SafeResponseModule.register({
  errorCodes: {
    404: 'RESOURCE_NOT_FOUND',
    409: 'DUPLICATE_ENTRY',
  },
})
```

카탈로그 우선순위와 전체 해석 순서는 [에러 카탈로그](#에러-카탈로그)를 참고하세요.

### 유틸리티 함수

```typescript
import { lookupErrorCode, lookupProblemTitle } from '@nestarc/safe-response';

lookupErrorCode(404);      // 'NOT_FOUND'
lookupProblemTitle(404);   // 'Not Found'
```

### 형상 불일치 경고

`@Paginated()`, `@CursorPaginated()`, `@SortMeta()`, `@FilterMeta()`가 적용되었지만 핸들러가 예상 형상과 다른 데이터를 반환하면 `Logger.warn()`이 라우트와 예상 형상을 포함하여 출력됩니다.

```typescript
SafeResponseModule.register({
  suppressWarnings: true,  // 형상 불일치 경고 억제
})
```

## 테스트 및 신뢰성

단위 테스트, 실제 HTTP 요청, 타입 검사, 설치된 패키지 검증으로 동작과 회귀를 확인합니다.

### 테스트 스위트

| 카테고리 | 수량 | 검증 범위 |
|----------|------|-----------|
| 단위 테스트 | 557 | Interceptor, Exception Filter, Module DI, Decorators, Client Type Guards, i18n Adapter, Global Errors, Shared Utilities, Error Catalog, Field Selection |
| E2E 테스트 (Express) | 73 | 실제 HTTP 요청/응답, 비동기 등록, 두 직렬화 순서, 요청 크기 초과 오류 검증 |
| E2E 테스트 (Fastify) | 64 | HTTP 래핑, 비동기 등록, 직렬화 순서, 동적 상태 코드, 반복 커서 필터 검증 |
| E2E 테스트 (Swagger) | 176 | undefined 응답, DTO 제약, 글로벌 오류의 fallback·등록 DTO를 포함한 실제 HTTP 계약 검증 |
| 타입 테스트 | 172 assertions | `tsd`로 공개 타입, 클라이언트·서버 일치, undefined 응답의 data 생략 검증 |
| 패키지 소비자 테스트 | 런타임 2개 + 타입 해석 4종 | 실제 tarball 설치, CJS·ESM import, Fastify 응답, Swagger, 공개 패키지명 타입 해석 검증 |
| 배포 검증 | 13 | `node:test`로 태그·ref·버전 일치 및 npm 채널 선택 검증 |
| 벤치마크 실행기 | 9 | `node:test`로 설정, 통계, 사전 검증, 실행 순서, 자원 정리 검증 |
| 스냅샷 | 2 | Swagger `components/schemas` + `paths` 회귀 감지 |

```bash
npm test              # 단위 테스트
npm run test:e2e      # E2E 테스트 (Express + Fastify + Swagger)
npm run test:cov      # 단위 테스트 + 아래 표의 커버리지 임계값 적용
npm run test:types    # Public API 타입 검증
npm run test:package  # 빌드·패키징·설치 후 소비자 환경에서 검증
npm run test:release  # 배포 태그·버전·채널 검증 테스트
npm run test:bench    # 벤치마크 실행기 회귀 테스트
npm run bench         # HTTP 지연 시간 벤치마크
```

### CI 파이프라인

`main` 브랜치의 push와 `main`을 대상으로 하는 pull request에서 GitHub Actions 전체 매트릭스 실행:

```
Node 18/20/22/24 × NestJS 10 + @nestjs/swagger 8
Node 20/22/24    × NestJS 11 + @nestjs/swagger 11
→ build → test:cov (임계값 강제) → test:e2e → test:types:built → test:package:built
```

의존성은 Node 24에서 설치한 뒤 각 검증 대상 Node 버전으로 전환합니다. 린트, 배포 검증 테스트, 벤치마크 실행기 테스트, Codecov 업로드는 Node 24 / NestJS 11 작업에서 실행합니다. 각 작업은 한 번 빌드한 결과를 `test:types:built`로 검사합니다. 로컬 `test:types` 명령은 기존처럼 빌드부터 실행합니다.

패키지 테스트는 생성된 tarball과 현재 매트릭스의 필수 peer 버전을 격리된 임시 소비자 환경에 설치합니다. 배포 파일, 루트·`/client` 공개 import, 실제 HTTP 어댑터 동작, 레거시 Node·NodeNext CJS/ESM·Bundler의 엄격한 타입 검사를 수행합니다. 설치 중 npm에 접속할 수 있으며 라이프사이클 스크립트는 비활성화합니다. 실패하면 소비자 환경과 로그를 보존합니다. 기존 배포 파일을 재빌드·재패키징 없이 검사하려면 `npm run test:package:built -- /path/to/package.tgz`를 실행합니다.

### 배포 워크플로

GitHub Release를 게시하면 Node 24에서 배포 워크플로가 실행됩니다. 의존성 설치 전에 실행 태그, `package.json`, `package-lock.json`의 두 버전 항목이 일치하는지 확인합니다. 태그는 빌드 메타데이터 없이 `vX.Y.Z` 또는 `vX.Y.Z-prerelease` 형식이어야 합니다. GitHub Release의 pre-release 표시도 버전과 일치해야 하며, 정식 버전은 npm `latest`, 시험 버전은 `next`로 배포합니다.

수동 배포에서는 이미 존재하는 태그를 실행 ref와 `tag` 입력에 동일하게 지정합니다.

```bash
gh workflow run release.yml --ref v0.16.0 -f tag=v0.16.0
```

브랜치나 다른 태그에서 실행하면 검증에 실패합니다. 실행을 일으킨 커밋을 체크아웃하므로 패키지와 npm provenance가 같은 소스를 가리킵니다. 배포 검증 테스트, 린트, 커버리지, E2E, 타입 검사를 거치고 한 번 빌드한 결과를 패키징합니다. 그 tarball을 격리된 소비자 환경에서 검사한 뒤 같은 파일을 라이프사이클 스크립트 없이 배포합니다. 로컬에서 직접 `npm publish`를 실행할 때의 `prepublishOnly` 빌드는 유지합니다.

### 커버리지 임계값

CI에서 강제 — 아래 기준 미달 시 빌드 실패:

| 지표 | 임계값 |
|------|--------|
| Lines | 95% |
| Statements | 95% |
| Branches | 90% |
| Functions | 95% |

이 임계값은 배포 파일 전체가 아니라 Jest가 수집한 단위 테스트 커버리지에 적용됩니다. 현재 설정은 `**/index.ts`와 `**/interfaces/**`를 제외하므로 클라이언트·데코레이터·에러 카탈로그 진입점의 런타임 코드도 집계에서 빠집니다. 해당 모듈에도 테스트는 있지만 위 비율에는 포함되지 않습니다. `coverage/`는 로컬에서 생성하는 결과물이며 npm 패키지에 포함되지 않습니다.

### OpenAPI 스키마 유효성 검증

생성된 Swagger 문서는 E2E 테스트에서 `@apidevtools/swagger-parser`로 OpenAPI 스펙 유효성을 검증합니다. 잘못된 스키마 생성 시 테스트가 실패합니다.

Ajv로 실제 HTTP 응답을 생성된 응답 스키마에 대조합니다. 잘못된 DTO 필드와 오류 상세 타입이 계속 거부되는지도 검증합니다.

### API 계약 스냅샷

Swagger `components/schemas`와 `paths`가 스냅샷으로 고정됩니다. 의도치 않은 스키마 변경 시 테스트가 깨집니다 — 의도적 변경 시 `npx jest --config test/jest-e2e.json -u`로 스냅샷을 업데이트하세요.

### 성능

개발 의존성을 설치한 저장소에서 실행합니다.

```bash
npm run bench
# 동작 확인용 짧은 실행이며, 성능 판단에는 표본이 부족합니다.
BENCH_ROUNDS=2 BENCH_ITERATIONS=20 BENCH_WARMUP=5 npm run bench
```

`benchmarks/response-overhead.ts`는 Express에서 작은 객체를 반환하는 성공 응답(200)과 `NotFoundException` 오류(404)를 동시성 1로 측정하며, 기본 NestJS와 기본 옵션의 `SafeResponseModule`을 비교합니다. 각 앱은 측정 전에 루프백 주소로 한 번만 서버를 열고, 별도의 keep-alive 클라이언트에 동일한 연결 정책을 적용합니다. 측정 전에는 원본·래핑 응답의 본문을 검증합니다. 오류가 발생하면 0이 아닌 종료 코드를 반환하고 두 앱과 클라이언트를 정리합니다.

기본값은 6라운드이며, 각 라운드의 시나리오·비교 대상마다 500회 측정하고 50회 워밍업합니다. `BENCH_ROUNDS`(2–100의 짝수 정수), `BENCH_ITERATIONS`(1–10,000의 정수), `BENCH_WARMUP`(0–10,000의 정수)로 조정할 수 있습니다. 각 라운드에서 양쪽을 워밍업하고 원본·래핑 측정 순서를 교대합니다. 실행 환경, 표본 수, 지연 시간 백분위수, 라운드별 평균 차이의 평균·범위를 출력하며, 계산 정밀도는 출력 직전까지 유지합니다.

수치는 하나의 프로세스에서 직렬화·전송·클라이언트 처리까지 포함한 HTTP 전체 지연 시간입니다. 인터셉터 자체의 CPU 비용이나 Fastify, 선택 기능, 대형 응답, 동시 요청 처리량을 대표하지 않습니다. 같은 환경에서 반복 실행하고 변동 폭을 함께 확인하세요. 음수 차이는 측정 잡음일 수 있으며, 고정 오버헤드 보장이나 CI의 성능 임계값으로 사용하지 않습니다. `npm run test:bench`는 성능 측정과 별개로 실행기의 동작을 검증합니다.

## 호환성

| 의존성 | 버전 |
|--------|------|
| NestJS | v10, v11 |
| 플랫폼 | Express, Fastify |
| @nestjs/swagger | v8, v11 |
| Node.js | NestJS 10 사용 시 >= 18; NestJS 11 사용 시 >= 20 |
| RxJS | v7 |

CI는 NestJS 10 + Swagger 8, NestJS 11 + Swagger 11 조합을 검증하며, 위 표가 모든 메이저 버전 간 교차 조합을 보장하지는 않습니다. 저장소 개발 도구는 Node 24에서 실행하고, 소비자 런타임 검증은 이전 지원 Node 버전도 포함합니다.

## 라이선스

MIT
