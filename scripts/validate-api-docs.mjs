import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import MarkdownIt from 'markdown-it';
import {
  documentedApiPackages,
  generatedApiPackages,
} from '../data/package-catalog.mjs';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.dirname(scriptDir);
const apiDir = process.env.API_DOCS_DIR
  ? path.resolve(rootDir, process.env.API_DOCS_DIR)
  : path.join(rootDir, 'api');
const markdownParser = new MarkdownIt();
const packageNames = documentedApiPackages.map(({ slug }) => slug);
const provenanceFields = [
  'package',
  'slug',
  'repository',
  'version',
  'tag',
  'commit',
];

const errors = [];

async function isNonEmptyFile(filePath) {
  try {
    const fileStat = await stat(filePath);
    return fileStat.isFile() && fileStat.size > 0;
  } catch {
    return false;
  }
}

async function isFile(filePath) {
  try {
    return (await stat(filePath)).isFile();
  } catch {
    return false;
  }
}

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(entryPath)));
    } else if (entry.isFile()) {
      files.push(entryPath);
    }
  }

  return files;
}

function localLinkDestinations(markdown) {
  const destinations = [];
  const visit = (tokens) => {
    for (const token of tokens) {
      if (token.type === 'link_open') {
        const destination = token.attrGet('href');
        if (destination !== null) destinations.push(destination);
      } else if (token.type === 'image') {
        const destination = token.attrGet('src');
        if (destination !== null) destinations.push(destination);
      }
      if (token.children) visit(token.children);
    }
  };

  visit(markdownParser.parse(markdown, {}));
  return destinations;
}

function lineForDestination(markdown, destination) {
  const offset = markdown.indexOf(destination);
  if (offset === -1) {
    return null;
  }

  return markdown.slice(0, offset).split('\n').length;
}

function normalizeDestination(destination) {
  let value = destination;
  if (value.startsWith('<') && value.endsWith('>')) {
    value = value.slice(1, -1);
  }

  try {
    value = decodeURIComponent(value);
  } catch {
    return null;
  }

  return value.split(/[?#]/, 1)[0];
}

function isExternalOrRoute(destination) {
  return (
    destination === '' ||
    destination.startsWith('#') ||
    destination.startsWith('/') ||
    destination.startsWith('//') ||
    /^[a-z][a-z\d+.-]*:/i.test(destination)
  );
}

async function localTargetExists(sourceFile, destination) {
  const normalized = normalizeDestination(destination);
  if (normalized === null) {
    return false;
  }
  if (isExternalOrRoute(normalized)) {
    return true;
  }

  const target = path.resolve(path.dirname(sourceFile), normalized);
  const relativeTarget = path.relative(apiDir, target);
  if (relativeTarget.startsWith('..') || path.isAbsolute(relativeTarget)) {
    return false;
  }
  const candidates = [target, `${target}.md`, path.join(target, 'index.md')];
  return (await Promise.all(candidates.map(isFile))).some(Boolean);
}

const topLevelDirectories = (await readdir(apiDir, { withFileTypes: true }))
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();
const expectedDirectories = [...packageNames].sort();

if (topLevelDirectories.join('\n') !== expectedDirectories.join('\n')) {
  const missing = expectedDirectories.filter(
    (name) => !topLevelDirectories.includes(name),
  );
  const unexpected = topLevelDirectories.filter(
    (name) => !expectedDirectories.includes(name),
  );
  if (missing.length > 0) errors.push(`Missing API directories: ${missing.join(', ')}`);
  if (unexpected.length > 0) {
    errors.push(`Unexpected API directories: ${unexpected.join(', ')}`);
  }
}

for (const catalogPackage of generatedApiPackages) {
  const packageName = catalogPackage.slug;
  const packageDir = path.join(apiDir, packageName);
  const indexPath = path.join(packageDir, 'index.md');
  if (!(await isNonEmptyFile(indexPath))) {
    errors.push(`Missing or empty API entry: api/${packageName}/index.md`);
    continue;
  }

  const index = await readFile(indexPath, 'utf8');
  if (!index.startsWith(`# @nestarc/${packageName}\n`)) {
    errors.push(
      `api/${packageName}/index.md must start with "# @nestarc/${packageName}"`,
    );
  }
  if (index.includes('.typedoc-work/') || /Defined in: \[src\/src\//.test(index)) {
    errors.push(`api/${packageName}/index.md exposes an invalid source path`);
  }

  const provenancePath = path.join(packageDir, '.generated.json');
  let provenance;
  try {
    provenance = JSON.parse(await readFile(provenancePath, 'utf8'));
  } catch {
    errors.push(`Missing or invalid API provenance: api/${packageName}/.generated.json`);
  }

  if (
    provenance !== undefined &&
    (provenance === null || typeof provenance !== 'object' || Array.isArray(provenance))
  ) {
    errors.push(`API provenance must be a JSON object: api/${packageName}/.generated.json`);
    provenance = undefined;
  }

  if (provenance !== undefined) {
    const actualFields = Object.keys(provenance).sort();
    const expectedFields = [...provenanceFields].sort();
    if (actualFields.join('\n') !== expectedFields.join('\n')) {
      errors.push(
        `api/${packageName}/.generated.json must contain exactly: ${provenanceFields.join(', ')}`,
      );
    }

    const expectedProvenance = {
      package: `@nestarc/${catalogPackage.slug}`,
      slug: catalogPackage.slug,
      repository: catalogPackage.repository,
      version: catalogPackage.version,
      tag: `v${catalogPackage.version}`,
    };
    for (const [field, expectedValue] of Object.entries(expectedProvenance)) {
      if (provenance[field] !== expectedValue) {
        errors.push(
          `api/${packageName}/.generated.json ${field} must be ${expectedValue}`,
        );
      }
    }

    if (!/^[0-9a-f]{40}$/.test(provenance.commit)) {
      errors.push(
        `api/${packageName}/.generated.json commit must be a full lowercase Git SHA`,
      );
    } else {
      const sourceCommits = new Set();
      const sourceRepositories = new Set();
      const sourceLinkPattern =
        /Defined in: \[[^\]]+\]\(https:\/\/github\.com\/nestarc\/([^/]+)\/blob\/([0-9a-f]{40})\//g;
      const packageMarkdownFiles = (await walk(packageDir)).filter((file) =>
        file.endsWith('.md'),
      );

      for (const markdownFile of packageMarkdownFiles) {
        const markdown = await readFile(markdownFile, 'utf8');
        for (const match of markdown.matchAll(sourceLinkPattern)) {
          sourceRepositories.add(match[1]);
          sourceCommits.add(match[2]);
        }
      }

      if (sourceRepositories.size === 0 || sourceCommits.size === 0) {
        errors.push(`api/${packageName} does not contain TypeDoc source provenance links`);
      } else if (
        sourceRepositories.size !== 1 ||
        !sourceRepositories.has(catalogPackage.repository)
      ) {
        errors.push(
          `api/${packageName} source links do not match repository ${catalogPackage.repository}`,
        );
      }
      if (
        sourceCommits.size > 0 &&
        (sourceCommits.size !== 1 || !sourceCommits.has(provenance.commit))
      ) {
        errors.push(
          `api/${packageName} source links do not match provenance commit ${provenance.commit}`,
        );
      }
    }
  }

  const readmePath = path.join(packageDir, 'README.md');
  if (await isFile(readmePath)) {
    const readme = await readFile(readmePath, 'utf8');
    if (/\]\(\.\/LICENSE(?:[)#?]|$)/.test(readme)) {
      const licensePath = path.join(packageDir, 'LICENSE.md');
      if (!(await isNonEmptyFile(licensePath))) {
        errors.push(
          `api/${packageName}/README.md links to ./LICENSE without a non-empty LICENSE.md`,
        );
      }
    }
  }

  const mediaDir = path.join(packageDir, '_media');
  let mediaFiles = [];
  try {
    mediaFiles = await walk(mediaDir);
  } catch {
    // _media is optional.
  }

  for (const mediaFile of mediaFiles) {
    const basename = path.basename(mediaFile);
    if (basename === 'README.md') {
      const siblingPage = `${path.dirname(mediaFile)}.md`;
      if (!(await isNonEmptyFile(siblingPage))) {
        errors.push(
          `${path.relative(rootDir, mediaFile)} is missing sibling page ${path.relative(rootDir, siblingPage)}`,
        );
      }
    } else if (!basename.includes('.')) {
      const siblingPage = `${mediaFile}.md`;
      if (!(await isNonEmptyFile(siblingPage))) {
        errors.push(
          `${path.relative(rootDir, mediaFile)} is missing sibling page ${path.relative(rootDir, siblingPage)}`,
        );
      }
    }
  }
}

const markdownFiles = (await walk(apiDir)).filter((file) => file.endsWith('.md'));
for (const markdownFile of markdownFiles) {
  const markdown = await readFile(markdownFile, 'utf8');
  for (const destination of localLinkDestinations(markdown)) {
    if (!(await localTargetExists(markdownFile, destination))) {
      const line = lineForDestination(markdown, destination);
      errors.push(
        `${path.relative(rootDir, markdownFile)}${line ? `:${line}` : ''} has a missing local target: ${destination}`,
      );
    }
  }
}

if (errors.length > 0) {
  console.error('API documentation validation failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log(
    `Validated ${generatedApiPackages.length} generated API packages, ${packageNames.length} documented API packages, and ${markdownFiles.length} Markdown files.`,
  );
}
