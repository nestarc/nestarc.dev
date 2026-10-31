// Installation groups describe a compatible composition, while the catalog
// continues to show each package's latest standalone release.
const reviewedOutboxVersions = {
  '0.4.0': '0.3.0',
  '0.4.1': '0.3.0',
  '0.4.2': '0.4.1',
}

export function buildAdoptionInstallCommand(packages) {
  const jobs = packages.find((pkg) => pkg.slug === 'jobs')
  const hasOutbox = packages.some((pkg) => pkg.slug === 'outbox')

  if (jobs && hasOutbox && !Object.hasOwn(reviewedOutboxVersions, jobs.version)) {
    throw new Error(`Review the Outbox peer range before grouping Jobs ${jobs.version}`)
  }

  const specs = packages.map((pkg) => {
    // Pin the reviewed pair even when a newer standalone Outbox is cataloged.
    const version = jobs && pkg.slug === 'outbox'
      ? reviewedOutboxVersions[jobs.version]
      : pkg.version
    return `@nestarc/${pkg.slug}@${version}`
  })

  return `npm install ${specs.join(' ')}`
}
