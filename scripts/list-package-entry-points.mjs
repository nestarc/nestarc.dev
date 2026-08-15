import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

function exportedSubpaths(exportsField) {
  if (!exportsField || typeof exportsField !== 'object' || Array.isArray(exportsField)) {
    return ['.']
  }

  const keys = Object.keys(exportsField)
  const subpaths = keys.filter((key) => key === '.' || key.startsWith('./'))
  return subpaths.length > 0 ? subpaths : ['.']
}

function targetStrings(value) {
  if (typeof value === 'string') return [value]
  if (Array.isArray(value)) return value.flatMap(targetStrings)
  if (!value || typeof value !== 'object') return []
  return Object.values(value).flatMap(targetStrings)
}

function sourceCandidates(subpath, exportTarget) {
  const candidates = []
  for (const target of targetStrings(exportTarget)) {
    const match = /^\.\/dist\/(.+?)(?:\.d)?\.(?:[cm]?js|ts)$/.exec(target)
    if (match) candidates.push(`src/${match[1]}.ts`)
  }

  if (subpath === '.') {
    candidates.push('src/index.ts')
  } else {
    const relative = subpath.slice(2)
    candidates.push(`src/${relative}.ts`, `src/${relative}/index.ts`)
  }
  return [...new Set(candidates)]
}

export function listPackageEntryPoints(packageDir) {
  const packagePath = path.join(packageDir, 'package.json')
  const packageJson = JSON.parse(readFileSync(packagePath, 'utf8'))
  const subpaths = exportedSubpaths(packageJson.exports)
  const entryPoints = []

  for (const subpath of subpaths) {
    if (subpath === './package.json') continue
    if (subpath.includes('*')) {
      throw new Error(`Wildcard package export is not supported: ${subpath}`)
    }

    const exportTarget = packageJson.exports?.[subpath]
    const entryPoint = sourceCandidates(subpath, exportTarget)
      .find((candidate) => existsSync(path.join(packageDir, candidate)))
    if (!entryPoint) {
      throw new Error(`Public export ${subpath} has no matching TypeScript source entry point`)
    }
    entryPoints.push(entryPoint)
  }

  return [...new Set(entryPoints)]
}

const scriptPath = fileURLToPath(import.meta.url)
if (process.argv[1] && path.resolve(process.argv[1]) === scriptPath) {
  try {
    const packageDir = path.resolve(process.argv[2] ?? '')
    process.stdout.write(`${listPackageEntryPoints(packageDir).join('\n')}\n`)
  } catch (error) {
    console.error(error instanceof Error ? error.message : error)
    process.exitCode = 1
  }
}
