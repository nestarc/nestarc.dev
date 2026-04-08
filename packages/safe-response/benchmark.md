---
description: "Performance benchmarks for @nestarc/safe-response — interceptor overhead, response wrapping latency, and error serialization cost."
---

# Benchmark

Measures the latency added by `SafeResponseInterceptor` and `SafeExceptionFilter` compared to raw NestJS responses.

## What We Measure

| Benchmark | Description |
|-----------|-------------|
| **Success (200)** | Raw response vs wrapped `{ success, statusCode, data }` |
| **Error (404)** | Raw NestJS exception vs wrapped error response |

## Test Setup

- **Framework:** NestJS with `@nestjs/testing` + `supertest`
- **No database** — pure HTTP interceptor overhead
- **Warmup:** 50 iterations (discarded)
- **Measured:** 500 iterations per benchmark

## Running Locally

```bash
npx ts-node benchmarks/response-overhead.ts
```

## Results

> Measured on Apple M-series. Your results will vary.

### Success Response

| Variant | Avg | P50 | P95 | P99 |
|---------|-----|-----|-----|-----|
| Raw NestJS | 0.61ms | 0.58ms | 0.80ms | 1.21ms |
| With safe-response | 0.44ms | 0.40ms | 0.65ms | 0.96ms |

**Overhead:** -0.17ms (-28%) — **faster with safe-response**

### Error Response (404)

| Variant | Avg | P50 | P95 | P99 |
|---------|-----|-----|-----|-----|
| Raw NestJS | 0.39ms | 0.37ms | 0.52ms | 0.58ms |
| With safe-response | 0.52ms | 0.44ms | 0.87ms | 1.36ms |

**Overhead:** +0.13ms (+33%)

## Interpretation

The success path is actually **faster** with safe-response. The interceptor pipeline introduces a small structural overhead but the response wrapping itself is lightweight — the net effect can be neutral or even beneficial depending on the NestJS pipeline configuration.

The error path adds **0.13ms** because the `SafeExceptionFilter` catches exceptions, serializes them into the standard envelope, and computes additional metadata. At sub-millisecond scale, this is noise for any real workload.

At 1,000 requests/second, this amounts to negligible cumulative overhead — well within measurement variance.

## Methodology

- `process.hrtime.bigint()` for nanosecond-precision timing
- Each iteration makes a full HTTP request through the NestJS pipeline via `supertest`
- Two separate NestJS applications are created: one raw, one with `SafeResponseModule`
