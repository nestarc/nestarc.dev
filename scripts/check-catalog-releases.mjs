import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { packageCatalog, toolCatalog } from '../data/package-catalog.mjs'

const DEFAULT_REGISTRY_ORIGIN = 'https://registry.npmjs.org'
const DEFAULT_TIMEOUT_MS = 30_000
const DEFAULT_MAX_ATTEMPTS = 2
const DEFAULT_RETRY_DELAY_MS = 250
const RETRYABLE_HTTP_STATUSES = new Set([408, 425, 429])

const sleep = (delayMs) => new Promise((resolve) => setTimeout(resolve, delayMs))

export function registryRetryDelay(response, attempt, {
  baseDelayMs = DEFAULT_RETRY_DELAY_MS,
  now = Date.now,
} = {}) {
  const retryAfter = response?.headers?.get?.('retry-after')
  if (retryAfter) {
    const seconds = Number(retryAfter)
    if (Number.isFinite(seconds) && seconds >= 0) return seconds * 1_000

    const retryAt = Date.parse(retryAfter)
    if (Number.isFinite(retryAt)) return Math.max(retryAt - now(), 0)
  }

  return baseDelayMs * (2 ** Math.max(attempt - 1, 0))
}

export function catalogReleaseTargets({
  packages = packageCatalog,
  tools = toolCatalog,
} = {}) {
  return [
    ...packages.map(({ slug, version }) => ({
      kind: 'package',
      name: `@nestarc/${slug}`,
      currentVersion: version,
    })),
    ...tools.map(({ slug, version }) => ({
      kind: 'tool',
      name: `@nestarc/${slug}`,
      currentVersion: version,
    })),
  ]
}

export function registryPackageUrl(
  packageName,
  registryOrigin = DEFAULT_REGISTRY_ORIGIN,
) {
  return `${registryOrigin.replace(/\/+$/, '')}/${encodeURIComponent(packageName)}/latest`
}

export function latestVersionFromMetadata(metadata, packageName) {
  if (metadata === null || typeof metadata !== 'object' || Array.isArray(metadata)) {
    throw new Error(`npm registry returned invalid metadata for ${packageName}`)
  }

  const latestVersion = metadata.version ?? metadata['dist-tags']?.latest
  if (typeof latestVersion !== 'string' || latestVersion.trim() === '') {
    throw new Error(`npm registry metadata for ${packageName} is missing the latest version`)
  }

  return latestVersion.trim()
}

export async function fetchLatestVersion(packageName, {
  fetchImpl = globalThis.fetch,
  registryOrigin = DEFAULT_REGISTRY_ORIGIN,
  timeoutMs = DEFAULT_TIMEOUT_MS,
  maxAttempts = DEFAULT_MAX_ATTEMPTS,
  sleepImpl = sleep,
  retryBaseDelayMs = DEFAULT_RETRY_DELAY_MS,
  now = Date.now,
} = {}) {
  if (typeof fetchImpl !== 'function') {
    throw new Error('A fetch implementation is required to query npm releases')
  }

  if (!Number.isInteger(maxAttempts) || maxAttempts < 1) {
    throw new Error('maxAttempts must be a positive integer')
  }

  let lastTransportError
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    let response
    try {
      response = await fetchImpl(registryPackageUrl(packageName, registryOrigin), {
        headers: { accept: 'application/json' },
        signal: AbortSignal.timeout(timeoutMs),
      })
    } catch (error) {
      lastTransportError = error
      if (attempt < maxAttempts) {
        await sleepImpl(registryRetryDelay(null, attempt, {
          baseDelayMs: retryBaseDelayMs,
          now,
        }))
        continue
      }
      throw new Error(
        `npm registry request for ${packageName} failed after ${maxAttempts} attempt(s): ${error instanceof Error ? error.message : error}`,
        { cause: error },
      )
    }

    if (!response.ok) {
      const retryable = response.status >= 500
        || RETRYABLE_HTTP_STATUSES.has(response.status)
      if (retryable && attempt < maxAttempts) {
        await sleepImpl(registryRetryDelay(response, attempt, {
          baseDelayMs: retryBaseDelayMs,
          now,
        }))
        continue
      }
      throw new Error(
        `npm registry request for ${packageName} failed with HTTP ${response.status}`,
      )
    }

    let metadata
    try {
      metadata = await response.json()
    } catch (error) {
      if (attempt < maxAttempts) {
        lastTransportError = error
        await sleepImpl(registryRetryDelay(response, attempt, {
          baseDelayMs: retryBaseDelayMs,
          now,
        }))
        continue
      }
      throw new Error(`npm registry returned invalid JSON for ${packageName}`)
    }

    return latestVersionFromMetadata(metadata, packageName)
  }

  throw new Error(
    `npm registry request for ${packageName} failed: ${lastTransportError instanceof Error ? lastTransportError.message : lastTransportError}`,
  )
}

export function compareCatalogVersions(releases) {
  const matches = []
  const drifts = []

  for (const release of releases) {
    const destination = release.currentVersion === release.latestVersion
      ? matches
      : drifts
    destination.push({ ...release })
  }

  return {
    checkedCount: releases.length,
    matches,
    drifts,
  }
}

export async function checkCatalogReleases({
  targets = catalogReleaseTargets(),
  fetchLatest = fetchLatestVersion,
} = {}) {
  const releases = await Promise.all(targets.map(async (target) => ({
    ...target,
    latestVersion: await fetchLatest(target.name),
  })))

  return compareCatalogVersions(releases)
}

export function formatCatalogReleaseReport(report) {
  if (report.drifts.length === 0) {
    return `Catalog releases are current: ${report.checkedCount} entries match npm dist-tag latest.`
  }

  return [
    'Catalog release drift detected:',
    ...report.drifts.map(({ name, currentVersion, latestVersion }) =>
      `- ${name}: current ${currentVersion}, latest ${latestVersion}`),
    '',
    'Update data/package-catalog.mjs and regenerate the affected API reference.',
  ].join('\n')
}

const scriptPath = fileURLToPath(import.meta.url)
if (process.argv[1] && path.resolve(process.argv[1]) === scriptPath) {
  try {
    const report = await checkCatalogReleases()
    const output = formatCatalogReleaseReport(report)

    if (report.drifts.length > 0) {
      console.error(output)
      process.exitCode = 1
    } else {
      console.log(output)
    }
  } catch (error) {
    console.error(
      `Catalog release check failed: ${error instanceof Error ? error.message : error}`,
    )
    process.exitCode = 1
  }
}
