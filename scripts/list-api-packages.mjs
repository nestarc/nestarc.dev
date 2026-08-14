import { generatedApiPackages } from '../data/package-catalog.mjs';

if (generatedApiPackages.length === 0) {
  throw new Error('Package catalog does not contain any generated API packages');
}

for (const { repository, slug, version } of generatedApiPackages) {
  const fields = [repository, slug, version, `v${version}`];
  if (
    fields.some(
      (field) =>
        typeof field !== 'string' || field.length === 0 || /[\t\r\n]/.test(field),
    )
  ) {
    throw new Error(`Invalid API package TSV fields for ${slug ?? repository}`);
  }

  process.stdout.write(`${fields.join('\t')}\n`);
}
