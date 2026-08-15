const SAFE_IDENTIFIER = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const CONTROL_CHARACTER = /[\u0000-\u001f\u007f-\u009f]/
const SEMVER = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[A-Za-z-][0-9A-Za-z-]*)(?:\.(?:0|[1-9]\d*|\d*[A-Za-z-][0-9A-Za-z-]*))*))?(?:\+([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?$/

const PACKAGE_SUPPORT_STATUSES = new Set(['Supported', 'Preview'])
const PACKAGE_API_STATUSES = new Set(['Generated', 'Curated'])
const TOOL_SUPPORT_STATUSES = new Set(['Labs'])

export class PackageCatalogValidationError extends Error {
  constructor(issues) {
    super(`Invalid package catalog:\n- ${issues.join('\n- ')}`)
    this.name = 'PackageCatalogValidationError'
    this.issues = issues
  }
}

function isPlainObject(value) {
  if (value === null || typeof value !== 'object') return false
  const prototype = Object.getPrototypeOf(value)
  return prototype === Object.prototype || prototype === null
}

function collection(value, label, issues) {
  if (!Array.isArray(value)) {
    issues.push(`${label} must be an array`)
    return []
  }
  if (value.length === 0) issues.push(`${label} must not be empty`)
  return value
}

function objectEntry(value, label, issues) {
  if (!isPlainObject(value)) {
    issues.push(`${label} must be a plain object`)
    return null
  }
  return value
}

function exactFields(value, expectedFields, label, issues) {
  const actualFields = Object.keys(value).sort()
  const expected = [...expectedFields].sort()
  if (actualFields.join('\n') !== expected.join('\n')) {
    issues.push(`${label} must contain exactly: ${expectedFields.join(', ')}`)
  }
}

function text(value, label, issues) {
  if (typeof value !== 'string' || value.trim() === '') {
    issues.push(`${label} must be a non-empty string`)
    return false
  }
  if (value !== value.trim()) {
    issues.push(`${label} must not have leading or trailing whitespace`)
  }
  if (CONTROL_CHARACTER.test(value)) {
    issues.push(`${label} must not contain control characters`)
  }
  return true
}

function identifier(value, label, issues) {
  if (!text(value, label, issues)) return false
  if (!SAFE_IDENTIFIER.test(value)) {
    issues.push(`${label} must be a path-safe lowercase identifier`)
    return false
  }
  return true
}

function exactSemver(value, label, issues) {
  if (!text(value, label, issues)) return
  if (!SEMVER.test(value)) issues.push(`${label} must be an exact semantic version`)
}

function enumValue(value, allowed, label, issues) {
  if (!text(value, label, issues)) return
  if (!allowed.has(value)) {
    issues.push(`${label} must be one of: ${[...allowed].join(', ')}`)
  }
}

function uniqueValue(value, seen, label, issues) {
  if (seen.has(value)) issues.push(`duplicate ${label}: ${String(value)}`)
  seen.add(value)
}

function selectionToken(value, owner, owners, issues) {
  const existingOwner = owners.get(value)
  if (existingOwner !== undefined && existingOwner !== owner) {
    issues.push(
      `catalog selector token ${value} is shared by ${existingOwner} and ${owner}`,
    )
    return
  }
  owners.set(value, owner)
}

function localizedSummary(value, label, issues) {
  const summary = objectEntry(value, label, issues)
  if (!summary) return
  exactFields(summary, ['en', 'ko'], label, issues)
  text(summary.en, `${label}.en`, issues)
  text(summary.ko, `${label}.ko`, issues)
}

/**
 * Validate the package catalog without reading the filesystem or mutating the
 * supplied data. All consumers can call this before deriving paths or shell
 * arguments from catalog values.
 */
export function validatePackageCatalog(input = {}) {
  if (!isPlainObject(input)) {
    throw new PackageCatalogValidationError(['catalog must be a plain object'])
  }

  const issues = []
  exactFields(input, [
    'packageCategories',
    'adoptionStages',
    'packageNavGroups',
    'packageCatalog',
    'toolCatalog',
  ], 'catalog', issues)

  const {
    packageCategories,
    adoptionStages,
    packageNavGroups,
    packageCatalog,
    toolCatalog,
  } = input
  const categories = collection(packageCategories, 'packageCategories', issues)
  const stages = collection(adoptionStages, 'adoptionStages', issues)
  const navGroups = collection(packageNavGroups, 'packageNavGroups', issues)
  const packages = collection(packageCatalog, 'packageCatalog', issues)
  const tools = collection(toolCatalog, 'toolCatalog', issues)

  const categoryIds = new Set()
  const categoryLabels = new Set()
  for (const [index, candidate] of categories.entries()) {
    const label = `packageCategories[${index}]`
    const category = objectEntry(candidate, label, issues)
    if (!category) continue
    exactFields(category, ['id', 'label'], label, issues)

    if (identifier(category.id, `${label}.id`, issues)) {
      uniqueValue(category.id, categoryIds, 'package category id', issues)
    }
    if (text(category.label, `${label}.label`, issues)) {
      uniqueValue(category.label, categoryLabels, 'package category label', issues)
    }
  }

  const adoptionSteps = new Set()
  const adoptionLabels = new Set()
  for (const [index, candidate] of stages.entries()) {
    const label = `adoptionStages[${index}]`
    const stage = objectEntry(candidate, label, issues)
    if (!stage) continue
    exactFields(stage, ['step', 'label', 'useWhen'], label, issues)

    if (!Number.isInteger(stage.step) || stage.step < 1) {
      issues.push(`${label}.step must be a positive integer`)
    } else {
      uniqueValue(stage.step, adoptionSteps, 'adoption step', issues)
      if (stage.step !== index + 1) {
        issues.push(`${label}.step must keep adoption stages contiguous and ordered`)
      }
    }
    if (text(stage.label, `${label}.label`, issues)) {
      uniqueValue(stage.label, adoptionLabels, 'adoption label', issues)
    }
    text(stage.useWhen, `${label}.useWhen`, issues)
  }
  const orderedSteps = [...adoptionSteps].sort((left, right) => left - right)
  for (const [index, step] of orderedSteps.entries()) {
    if (step !== index + 1) {
      issues.push('adoption steps must be contiguous and start at 1')
      break
    }
  }

  const seenSlugs = new Set()
  const seenRepositories = new Set()
  const selectorOwners = new Map()
  const usedCategories = new Set()
  const usedAdoptionSteps = new Set()

  for (const [index, candidate] of packages.entries()) {
    const label = `packageCatalog[${index}]`
    const item = objectEntry(candidate, label, issues)
    if (!item) continue
    exactFields(item, [
      'slug',
      'repository',
      'version',
      'supportStatus',
      'apiStatus',
      'category',
      'adoptionStage',
      'homeSummary',
      'solves',
      'startHere',
      'requiresCodeChanges',
      'dependsOn',
    ], label, issues)

    const owner = `packageCatalog[${index}]`
    if (identifier(item.slug, `${label}.slug`, issues)) {
      uniqueValue(item.slug, seenSlugs, 'catalog slug', issues)
      selectionToken(item.slug, owner, selectorOwners, issues)
    }
    if (identifier(item.repository, `${label}.repository`, issues)) {
      uniqueValue(item.repository, seenRepositories, 'catalog repository', issues)
      selectionToken(item.repository, owner, selectorOwners, issues)
    }
    exactSemver(item.version, `${label}.version`, issues)
    enumValue(item.supportStatus, PACKAGE_SUPPORT_STATUSES, `${label}.supportStatus`, issues)
    enumValue(item.apiStatus, PACKAGE_API_STATUSES, `${label}.apiStatus`, issues)

    if (!identifier(item.category, `${label}.category`, issues)) {
      // The identifier error is sufficient when the value is malformed.
    } else if (!categoryIds.has(item.category)) {
      issues.push(`${label}.category references unknown category: ${item.category}`)
    } else {
      usedCategories.add(item.category)
    }

    if (!Number.isInteger(item.adoptionStage) || item.adoptionStage < 1) {
      issues.push(`${label}.adoptionStage must be a positive integer`)
    } else if (!adoptionSteps.has(item.adoptionStage)) {
      issues.push(`${label}.adoptionStage references unknown step: ${item.adoptionStage}`)
    } else {
      usedAdoptionSteps.add(item.adoptionStage)
    }

    localizedSummary(item.homeSummary, `${label}.homeSummary`, issues)
    text(item.solves, `${label}.solves`, issues)
    text(item.startHere, `${label}.startHere`, issues)
    text(item.requiresCodeChanges, `${label}.requiresCodeChanges`, issues)
    text(item.dependsOn, `${label}.dependsOn`, issues)
  }

  for (const categoryId of categoryIds) {
    if (!usedCategories.has(categoryId)) {
      issues.push(`package category has no packages: ${categoryId}`)
    }
  }
  for (const step of adoptionSteps) {
    if (!usedAdoptionSteps.has(step)) issues.push(`adoption step has no packages: ${step}`)
  }

  const navLabels = new Set()
  const navLabelsKo = new Set()
  const navCategoryIds = new Set()
  for (const [index, candidate] of navGroups.entries()) {
    const label = `packageNavGroups[${index}]`
    const group = objectEntry(candidate, label, issues)
    if (!group) continue
    exactFields(group, ['label', 'labelKo', 'categories'], label, issues)

    if (text(group.label, `${label}.label`, issues)) {
      uniqueValue(group.label, navLabels, 'package nav label', issues)
    }
    if (text(group.labelKo, `${label}.labelKo`, issues)) {
      uniqueValue(group.labelKo, navLabelsKo, 'Korean package nav label', issues)
    }

    const groupCategories = collection(group.categories, `${label}.categories`, issues)
    for (const [categoryIndex, categoryId] of groupCategories.entries()) {
      const categoryLabel = `${label}.categories[${categoryIndex}]`
      if (!identifier(categoryId, categoryLabel, issues)) continue
      if (!categoryIds.has(categoryId)) {
        issues.push(`${categoryLabel} references unknown category: ${categoryId}`)
      }
      if (navCategoryIds.has(categoryId)) {
        issues.push(`package nav category appears more than once: ${categoryId}`)
      }
      navCategoryIds.add(categoryId)
    }
  }
  for (const categoryId of categoryIds) {
    if (!navCategoryIds.has(categoryId)) {
      issues.push(`package category is missing from navigation: ${categoryId}`)
    }
  }

  for (const [index, candidate] of tools.entries()) {
    const label = `toolCatalog[${index}]`
    const item = objectEntry(candidate, label, issues)
    if (!item) continue
    exactFields(item, [
      'slug',
      'repository',
      'version',
      'supportStatus',
      'homeSummary',
      'purpose',
    ], label, issues)

    const owner = `toolCatalog[${index}]`
    if (identifier(item.slug, `${label}.slug`, issues)) {
      uniqueValue(item.slug, seenSlugs, 'catalog slug', issues)
      selectionToken(item.slug, owner, selectorOwners, issues)
    }
    if (identifier(item.repository, `${label}.repository`, issues)) {
      uniqueValue(item.repository, seenRepositories, 'catalog repository', issues)
      selectionToken(item.repository, owner, selectorOwners, issues)
    }
    exactSemver(item.version, `${label}.version`, issues)
    enumValue(item.supportStatus, TOOL_SUPPORT_STATUSES, `${label}.supportStatus`, issues)
    localizedSummary(item.homeSummary, `${label}.homeSummary`, issues)
    text(item.purpose, `${label}.purpose`, issues)
  }

  if (issues.length > 0) throw new PackageCatalogValidationError(issues)
  return true
}
