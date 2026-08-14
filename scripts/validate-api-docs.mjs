import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import MarkdownIt from 'markdown-it';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.dirname(scriptDir);
const apiDir = path.join(rootDir, 'api');
const markdownParser = new MarkdownIt();
const packageNames = [
  'tenancy',
  'safe-response',
  'audit-log',
  'feature-flag',
  'soft-delete',
  'pagination',
  'idempotency',
  'outbox',
  'webhook',
  'api-keys',
  'data-subject',
  'jobs',
  'rbac',
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

for (const packageName of packageNames) {
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
  console.log(`Validated ${packageNames.length} API packages and ${markdownFiles.length} Markdown files.`);
}
