import assert from 'node:assert/strict';
import { setTimeout } from 'node:timers/promises';
import { ApiKeysService, type CreateApiKeyResult } from '@nestarc/api-keys';
import { createApp } from './app';
import { requiredEnv } from './config';

interface Report { id: string; tenantId: string; title: string }
interface Rotation extends CreateApiKeyResult { replacedKeyId: string; graceExpiresAt: string }

async function main() {
  let instance = await createApp(3_000);
  const createdKeyIds: string[] = [];
  let baseUrl = '';
  const adminA = requiredEnv('DEMO_ADMIN_TOKEN_A');
  const adminB = requiredEnv('DEMO_ADMIN_TOKEN_B');

  async function listen() {
    await instance.app.listen(0, '127.0.0.1');
    baseUrl = await instance.app.getUrl();
  }

  async function request<T = unknown>(
    method: string, path: string, expectedStatus: number, token?: string, body?: unknown,
  ): Promise<T> {
    const response = await fetch(`${baseUrl}${path}`, {
      method,
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      },
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
      signal: AbortSignal.timeout(5_000),
    });
    assert.equal(response.status, expectedStatus, `${method} ${path} status`);
    return (response.status === 204 ? undefined : await response.json()) as T;
  }

  async function denied(method: string, path: string, token: string | undefined, status: number, code: string) {
    const result = await request<{ code: string }>(method, path, status, token);
    assert.equal(result.code, code, `${method} ${path} error code`);
  }

  async function issue(admin: string, body?: unknown) {
    const key = await request<CreateApiKeyResult>('POST', '/admin/api-keys', 201, admin, body);
    createdKeyIds.push(key.id);
    assert.equal(typeof key.key, 'string');
    assert.deepEqual(Object.keys(key).sort(), ['id', 'key']);
    return key;
  }

  try {
    await listen();
    await request('POST', '/admin/api-keys', 401);
    await request('POST', '/admin/api-keys', 401, 'wrong-admin-token');

    // Body input cannot select a tenant, increase scopes, or change the environment.
    const keyA = await issue(adminA, {
      tenantId: 'tenant-b', scopes: [{ resource: 'reports', level: 'write' }], environment: 'test',
    });
    const keyB = await issue(adminB);
    const stored = await instance.prisma.apiKey.findUniqueOrThrow({ where: { id: keyA.id } });
    assert.equal(stored.tenantId, 'tenant-a');
    assert.deepEqual(stored.scopes, ['reports:read']);
    assert.equal(stored.environment, 'live');
    assert.equal(stored.createdBy, 'admin-a');
    assert.equal(JSON.stringify(stored).includes(keyA.key), false, 'raw key must not be stored');

    const reportsA = await request<Report[]>('GET', '/reports', 200, keyA.key);
    const reportsB = await request<Report[]>('GET', '/reports', 200, keyB.key);
    assert.ok(reportsA.some((report) => report.id === 'report-a'), 'Run npm run db:setup first');
    assert.ok(reportsB.some((report) => report.id === 'report-b'), 'Run npm run db:setup first');
    assert.ok(reportsA.every((report) => report.tenantId === 'tenant-a'));
    assert.ok(reportsB.every((report) => report.tenantId === 'tenant-b'));
    await request('GET', '/reports/report-a', 200, keyA.key);
    const otherTenant = await request('GET', '/reports/report-b', 404, keyA.key);
    const missingReport = await request('GET', '/reports/nonexistent-report', 404, keyA.key);
    assert.deepEqual(otherTenant, missingReport);

    await denied('GET', '/reports', undefined, 401, 'api_key_missing');
    const last = keyA.key.at(-1);
    const tamperedKey = keyA.key.slice(0, -1) + (last === 'a' ? 'b' : 'a');
    await denied('GET', '/reports', tamperedKey, 401, 'api_key_invalid');
    const beforeWrite = await instance.prisma.report.count();
    const writeError = await request<{ code: string }>('POST', '/reports', 403, keyA.key, { title: 'Forbidden' });
    assert.equal(writeError.code, 'api_key_scope_insufficient');
    assert.equal(await instance.prisma.report.count(), beforeWrite, 'denied writes must not mutate');

    const testKey = await instance.app.get(ApiKeysService).create({
      tenantId: 'tenant-a', name: 'Smoke environment check', environment: 'test',
      scopes: [{ resource: 'reports', level: 'read' }],
    });
    createdKeyIds.push(testKey.id);
    await denied('GET', '/reports', testKey.key, 403, 'api_key_environment_mismatch');

    // The global login guard still protects management routes from machine keys.
    await request('POST', '/admin/api-keys', 401, keyA.key);
    await request('DELETE', `/admin/api-keys/${keyA.id}`, 401, keyA.key);
    await request('POST', `/admin/api-keys/${keyA.id}/rotate`, 401, keyA.key);
    for (const [method, suffix] of [['DELETE', ''], ['POST', '/rotate']]) {
      const crossTenant = await request(method, `/admin/api-keys/${keyB.id}${suffix}`, 404, adminA);
      const missing = await request(method, `/admin/api-keys/nonexistent-key${suffix}`, 404, adminA);
      assert.deepEqual(crossTenant, missing);
      await request('GET', '/reports', 200, keyB.key);
    }

    // Close and recreate the Nest application and Prisma pool; the key survives.
    await instance.app.close();
    instance = await createApp(3_000);
    await listen();
    await request('GET', '/reports', 200, keyA.key);

    const rotated = await request<Rotation>('POST', `/admin/api-keys/${keyA.id}/rotate`, 201, adminA);
    createdKeyIds.push(rotated.id);
    assert.equal(rotated.replacedKeyId, keyA.id);
    const deadline = Date.parse(rotated.graceExpiresAt);
    assert.ok(Number.isFinite(deadline));
    await request('GET', '/reports', 200, keyA.key);
    await request('GET', '/reports', 200, rotated.key);
    // Wait for the actual server deadline; no assumption about request duration.
    await setTimeout(Math.max(0, deadline - Date.now()) + 50);
    await denied('GET', '/reports', keyA.key, 401, 'api_key_expired');
    await request('GET', '/reports', 200, rotated.key);

    await request('DELETE', `/admin/api-keys/${rotated.id}`, 204, adminA);
    await denied('GET', '/reports', rotated.key, 401, 'api_key_revoked');
    await request('GET', '/reports', 200, keyB.key);

    console.log(JSON.stringify({
      package: '@nestarc/api-keys@0.4.0',
      storage: 'PostgreSQL',
      firstCall: 'passed',
      tenantIsolation: 'passed',
      scopeDenial: 'passed',
      environmentDenial: 'passed',
      adminBoundary: 'passed',
      tenantBoundManagement: 'passed',
      restartPersistence: 'passed',
      rotationGrace: 'passed',
      revocation: 'passed',
    }, null, 2));
  } finally {
    try {
      // Remove only keys created in this run; retain seed reports and other keys.
      await instance.prisma.apiKey.deleteMany({ where: { id: { in: createdKeyIds } } });
    } finally {
      await instance.app.close();
    }
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
