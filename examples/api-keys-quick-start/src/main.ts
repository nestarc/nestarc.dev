import { createApp } from './app';

async function main() {
  const port = Number(process.env.PORT ?? 3000);
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('Invalid PORT');
  const { app } = await createApp();
  app.enableShutdownHooks();
  try {
    await app.listen(port, '127.0.0.1');
    console.log(`Local demonstration API: http://127.0.0.1:${port}`);
  } catch (error) {
    await app.close();
    throw error;
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
