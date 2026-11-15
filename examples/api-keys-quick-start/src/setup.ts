import { createDatabase } from './database';

async function main() {
  const prisma = createDatabase();
  try {
    for (const report of [
      { id: 'report-a', tenantId: 'tenant-a', title: 'Acme monthly report' },
      { id: 'report-b', tenantId: 'tenant-b', title: 'Birch monthly report' },
    ]) {
      await prisma.report.upsert({ where: { id: report.id }, create: report, update: {} });
    }
    console.log('Seeded report-a (tenant-a) and report-b (tenant-b).');
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
