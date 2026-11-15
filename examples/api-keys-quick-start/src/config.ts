import 'dotenv/config';

export function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value?.trim()) throw new Error(`Set ${name}; copy .env.example for the local demo.`);
  return value;
}

export function demoAdmins() {
  const tokenA = requiredEnv('DEMO_ADMIN_TOKEN_A');
  const tokenB = requiredEnv('DEMO_ADMIN_TOKEN_B');
  if (tokenA === tokenB) throw new Error('The two demonstration admin tokens must differ.');
  return [
    { token: tokenA, tenantId: 'tenant-a', userId: 'admin-a' },
    { token: tokenB, tenantId: 'tenant-b', userId: 'admin-b' },
  ];
}
