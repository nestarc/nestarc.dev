import { execFileSync } from 'node:child_process'
import { createRequire } from 'node:module'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const GIT_COMMIT = /^[0-9a-f]{40}$/
const RELEASE_PROVENANCE_POLICIES = new Set(['gitHead', 'slsa'])
const SLSA_PROVENANCE_V1 = 'https://slsa.dev/provenance/v1'
const GITHUB_ACTIONS_ISSUER = 'https://token.actions.githubusercontent.com'

function npmPackagePurl(packageName, version) {
  if (packageName.startsWith('@')) {
    const separator = packageName.indexOf('/')
    if (separator === -1) return ''

    const scope = packageName.slice(0, separator)
    const name = packageName.slice(separator + 1)
    return `pkg:npm/${encodeURIComponent(scope)}/${encodeURIComponent(name)}@${encodeURIComponent(version)}`
  }

  return `pkg:npm/${encodeURIComponent(packageName)}@${encodeURIComponent(version)}`
}

function sha512IntegrityHex(integrity) {
  if (typeof integrity !== 'string') return ''

  const match = /^sha512-([A-Za-z0-9+/]+={0,2})$/.exec(integrity ?? '')
  if (!match) return ''

  const digest = Buffer.from(match[1], 'base64')
  if (digest.length !== 64 || digest.toString('base64') !== match[1]) return ''
  return digest.toString('hex')
}

function decodeStatement(bundle) {
  const envelope = bundle?.dsseEnvelope
  if (envelope?.payloadType !== 'application/vnd.in-toto+json') return null

  const payload = envelope?.payload
  if (typeof payload !== 'string' || payload.length === 0) return null

  try {
    const statement = JSON.parse(Buffer.from(payload, 'base64').toString('utf8'))
    return statement && typeof statement === 'object' && !Array.isArray(statement)
      ? statement
      : null
  } catch {
    return null
  }
}

function errorMessage(error) {
  return error instanceof Error ? error.message : String(error)
}

function npmGlobalRoot() {
  let root
  try {
    root = execFileSync('npm', ['root', '--global'], {
      encoding: 'utf8',
      maxBuffer: 64 * 1024,
      stdio: ['ignore', 'pipe', 'pipe'],
      timeout: 10_000,
    }).trim()
  } catch (error) {
    throw new Error(
      `unable to locate npm's bundled sigstore: ${errorMessage(error)}`,
    )
  }

  if (!root || !path.isAbsolute(root) || /[\0\r\n]/.test(root)) {
    throw new Error("npm returned an invalid global module root for bundled sigstore")
  }
  return root
}

export function loadNpmSigstoreVerify(options = {}) {
  const root = options.npmRoot ?? npmGlobalRoot()
  if (typeof root !== 'string' || !path.isAbsolute(root) || /[\0\r\n]/.test(root)) {
    throw new Error("npm returned an invalid global module root for bundled sigstore")
  }

  let sigstore
  try {
    const requireFromNpm = (options.createRequire ?? createRequire)(
      path.join(root, 'npm', 'package.json'),
    )
    sigstore = requireFromNpm('sigstore')
  } catch (error) {
    throw new Error(
      `npm's bundled sigstore is unavailable: ${errorMessage(error)}`,
    )
  }

  if (typeof sigstore?.verify !== 'function') {
    throw new Error("npm's bundled sigstore does not expose the required verify API")
  }
  return sigstore.verify
}

function escapeRegularExpression(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function workflowIdentityPattern(repository, tag) {
  const workflowPrefix =
    `https://github.com/nestarc/${repository}/.github/workflows/`
  const workflowSuffix = `@refs/tags/${tag}`
  return `^${escapeRegularExpression(workflowPrefix)}[^/@]+${escapeRegularExpression(workflowSuffix)}$`
}

export async function verifySigstoreBundle(
  bundle,
  repository,
  tag,
  options = {},
) {
  if (!bundle || typeof bundle !== 'object' || Array.isArray(bundle)) {
    throw new Error('npm SLSA attestation is missing a valid Sigstore bundle')
  }

  const sigstoreVerify = options.sigstoreVerify ?? loadNpmSigstoreVerify()
  if (typeof sigstoreVerify !== 'function') {
    throw new Error('npm Sigstore verifier does not expose the required verify API')
  }

  try {
    await sigstoreVerify(bundle, {
      certificateIssuer: GITHUB_ACTIONS_ISSUER,
      certificateIdentityURI: workflowIdentityPattern(repository, tag),
    })
  } catch (error) {
    throw new Error(`npm SLSA Sigstore verification failed: ${errorMessage(error)}`)
  }
}

async function verifySlsaProvenance(
  metadata,
  attestations,
  expectedVersion,
  sourceCommit,
  packageName,
  repository,
  tag,
  auditedVersion,
  auditedIntegrity,
  verifyBundle,
) {
  if (!repository || !tag) {
    throw new Error(
      `npm release ${packageName}@${expectedVersion} has no repository/tag for SLSA verification`,
    )
  }

  if (
    metadata?.dist?.attestations?.provenance?.predicateType !==
    SLSA_PROVENANCE_V1
  ) {
    throw new Error(
      `npm release ${packageName}@${expectedVersion} does not advertise SLSA provenance v1`,
    )
  }

  if (!Array.isArray(attestations?.attestations)) {
    throw new Error(
      `npm release ${packageName}@${expectedVersion} returned an invalid attestation response`,
    )
  }

  const slsaAttestations = attestations.attestations.filter(
    (attestation) => attestation?.predicateType === SLSA_PROVENANCE_V1,
  )
  if (slsaAttestations.length !== 1) {
    throw new Error(
      `npm release ${packageName}@${expectedVersion} must have exactly one SLSA provenance statement`,
    )
  }

  if (auditedVersion !== expectedVersion) {
    throw new Error(
      `audited npm package version ${String(auditedVersion)} does not match ${packageName}@${expectedVersion}`,
    )
  }
  const auditedDigest = sha512IntegrityHex(auditedIntegrity)
  if (!auditedDigest) {
    throw new Error(
      `audited lock entry for ${packageName}@${expectedVersion} is missing a valid sha512 integrity digest`,
    )
  }
  const metadataDigest = sha512IntegrityHex(metadata?.dist?.integrity)
  if (!metadataDigest) {
    throw new Error(
      `npm release ${packageName}@${expectedVersion} is missing a valid sha512 integrity digest`,
    )
  }
  if (metadataDigest !== auditedDigest) {
    throw new Error(
      `npm metadata integrity does not match the audited lock entry for ${packageName}@${expectedVersion}`,
    )
  }

  // Keep one local reference so cryptographic and semantic verification are
  // inseparable even if the caller's response object is later mutated.
  const bundle = slsaAttestations[0]?.bundle
  await verifyBundle(bundle, repository, tag)

  const statement = decodeStatement(bundle)
  if (
    statement?._type !== 'https://in-toto.io/Statement/v1' ||
    statement?.predicateType !== SLSA_PROVENANCE_V1
  ) {
    throw new Error(
      `npm release ${packageName}@${expectedVersion} has an invalid SLSA provenance statement`,
    )
  }

  const expectedSubject = npmPackagePurl(packageName, expectedVersion)
  const subjectMatches =
    Array.isArray(statement.subject) &&
    statement.subject.length === 1 &&
    statement.subject[0]?.name === expectedSubject &&
    statement.subject[0]?.digest?.sha512 === auditedDigest
  if (!subjectMatches) {
    throw new Error(
      `npm SLSA subject does not match ${packageName}@${expectedVersion} and its published sha512 digest`,
    )
  }

  const workflow = statement.predicate?.buildDefinition?.externalParameters?.workflow
  const expectedRepository = `https://github.com/nestarc/${repository}`
  const expectedRef = `refs/tags/${tag}`
  if (
    workflow?.repository !== expectedRepository ||
    workflow?.ref !== expectedRef
  ) {
    throw new Error(
      `npm SLSA workflow does not match ${expectedRepository}@${expectedRef}`,
    )
  }

  const expectedDependency = `git+${expectedRepository}@${expectedRef}`
  const resolvedDependencies =
    statement.predicate?.buildDefinition?.resolvedDependencies
  const matchingDependencies = Array.isArray(resolvedDependencies)
    ? resolvedDependencies.filter(
        (dependency) => dependency?.uri === expectedDependency,
      )
    : []
  if (
    matchingDependencies.length !== 1 ||
    matchingDependencies[0]?.digest?.gitCommit !== sourceCommit
  ) {
    throw new Error(
      `npm SLSA provenance does not match release tag commit ${sourceCommit} for ${packageName}@${expectedVersion}`,
    )
  }
}

export async function verifyReleaseProvenance(
  metadata,
  expectedVersion,
  sourceCommit,
  packageName,
  options = {},
) {
  if (!metadata || typeof metadata !== 'object' || Array.isArray(metadata)) {
    throw new Error(`npm returned invalid release metadata for ${packageName}`)
  }
  if (metadata.version !== expectedVersion) {
    throw new Error(
      `npm resolved ${packageName}@${expectedVersion} as ${String(metadata.version)}`,
    )
  }

  if (!GIT_COMMIT.test(sourceCommit ?? '')) {
    throw new Error(
      `release tag for ${packageName}@${expectedVersion} resolved to an invalid commit`,
    )
  }

  const releaseProvenance = options.releaseProvenance
  if (!RELEASE_PROVENANCE_POLICIES.has(releaseProvenance)) {
    throw new Error(
      `unsupported release provenance policy ${String(releaseProvenance)} for ${packageName}@${expectedVersion}`,
    )
  }

  if (releaseProvenance === 'gitHead') {
    if (!GIT_COMMIT.test(metadata.gitHead ?? '')) {
      throw new Error(
        `npm release ${packageName}@${expectedVersion} is missing a valid gitHead`,
      )
    }
    if (metadata.gitHead !== sourceCommit) {
      throw new Error(
        `npm gitHead ${metadata.gitHead} does not match release tag commit ${sourceCommit} for ${packageName}@${expectedVersion}`,
      )
    }
    return
  }

  const verifyBundle = options.verifyBundle ?? verifySigstoreBundle
  if (typeof verifyBundle !== 'function') {
    throw new Error('npm SLSA verifier does not expose a bundle verification API')
  }

  await verifySlsaProvenance(
    metadata,
    options.attestations,
    expectedVersion,
    sourceCommit,
    packageName,
    options.repository,
    options.tag,
    options.auditedVersion,
    options.auditedIntegrity,
    verifyBundle,
  )
}

const scriptPath = fileURLToPath(import.meta.url)
if (process.argv[1] && path.resolve(process.argv[1]) === scriptPath) {
  const main = async () => {
    const [
      rawMetadata,
      expectedVersion,
      sourceCommit,
      packageName,
      repository,
      tag,
      releaseProvenance,
      auditedVersion,
      auditedIntegrity,
    ] = process.argv.slice(2)
    const metadata = JSON.parse(rawMetadata)
    let attestations

    if (releaseProvenance === 'slsa') {
      const attestationUrl = metadata?.dist?.attestations?.url
      if (typeof attestationUrl !== 'string' || attestationUrl.length === 0) {
        throw new Error(
          `npm release ${packageName}@${expectedVersion} is missing an attestation URL required by SLSA policy`,
        )
      }

      const url = new URL(attestationUrl)
      const attestationPrefix = '/-/npm/v1/attestations/'
      const encodedTarget = url.pathname.slice(attestationPrefix.length)
      let decodedTarget = ''
      try {
        decodedTarget = decodeURIComponent(encodedTarget)
      } catch {
        // The validation below reports one fail-closed error for malformed and
        // unexpected attestation URLs.
      }
      if (
        url.protocol !== 'https:' ||
        url.hostname !== 'registry.npmjs.org' ||
        url.port !== '' ||
        url.username !== '' ||
        url.password !== '' ||
        url.search !== '' ||
        url.hash !== '' ||
        !url.pathname.startsWith(attestationPrefix) ||
        decodedTarget !== `${packageName}@${expectedVersion}`
      ) {
        throw new Error(`refusing unexpected npm attestation URL: ${attestationUrl}`)
      }

      const response = await fetch(url, {
        headers: { accept: 'application/json' },
        signal: AbortSignal.timeout(15_000),
      })
      if (!response.ok) {
        throw new Error(
          `npm attestation request for ${packageName}@${expectedVersion} failed with HTTP ${response.status}`,
        )
      }
      attestations = await response.json()
    }

    await verifyReleaseProvenance(
      metadata,
      expectedVersion,
      sourceCommit,
      packageName,
      {
        attestations,
        repository,
        tag,
        releaseProvenance,
        auditedVersion,
        auditedIntegrity,
      },
    )
  }

  try {
    await main()
  } catch (error) {
    console.error(error instanceof Error ? error.message : error)
    process.exitCode = 1
  }
}
