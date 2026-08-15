import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const GIT_COMMIT = /^[0-9a-f]{40}$/

export function verifyReleaseProvenance(
  metadata,
  expectedVersion,
  sourceCommit,
  packageName,
) {
  if (!metadata || typeof metadata !== 'object' || Array.isArray(metadata)) {
    throw new Error(`npm returned invalid release metadata for ${packageName}`)
  }
  if (metadata.version !== expectedVersion) {
    throw new Error(
      `npm resolved ${packageName}@${expectedVersion} as ${String(metadata.version)}`,
    )
  }
  if (!GIT_COMMIT.test(metadata.gitHead ?? '')) {
    throw new Error(`npm release ${packageName}@${expectedVersion} is missing a valid gitHead`)
  }
  if (metadata.gitHead !== sourceCommit) {
    throw new Error(
      `npm gitHead ${metadata.gitHead} does not match release tag commit ${sourceCommit} for ${packageName}@${expectedVersion}`,
    )
  }
}

const scriptPath = fileURLToPath(import.meta.url)
if (process.argv[1] && path.resolve(process.argv[1]) === scriptPath) {
  try {
    const [rawMetadata, expectedVersion, sourceCommit, packageName] = process.argv.slice(2)
    verifyReleaseProvenance(
      JSON.parse(rawMetadata),
      expectedVersion,
      sourceCommit,
      packageName,
    )
  } catch (error) {
    console.error(error instanceof Error ? error.message : error)
    process.exitCode = 1
  }
}
