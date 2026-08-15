import { generatedApiPackages } from '../data/package-catalog.mjs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

export function apiPackageTsv(packages = generatedApiPackages) {
  if (packages.length === 0) {
    throw new Error('Package catalog does not contain any generated API packages');
  }

  return packages.map(({ repository, slug, version }) => {
    const fields = [repository, slug, version, `v${version}`];
    if (
      fields.some(
        (field) =>
          typeof field !== 'string' || field.length === 0 || /[\t\r\n]/.test(field),
      )
    ) {
      throw new Error(`Invalid API package TSV fields for ${slug ?? repository}`);
    }
    return fields.join('\t');
  }).join('\n');
}

const scriptPath = fileURLToPath(import.meta.url);
if (process.argv[1] && path.resolve(process.argv[1]) === scriptPath) {
  try {
    process.stdout.write(`${apiPackageTsv()}\n`);
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}
