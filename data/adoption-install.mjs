// Installation groups describe a compatible composition, while the catalog
// continues to show each package's latest standalone release.
export function buildAdoptionInstallCommand(packages) {
  const jobs = packages.find((pkg) => pkg.slug === 'jobs')
  const hasOutbox = packages.some((pkg) => pkg.slug === 'outbox')

  if (jobs && hasOutbox && !['0.4.0', '0.4.1'].includes(jobs.version)) {
    throw new Error(`Review the Outbox peer range before grouping Jobs ${jobs.version}`)
  }

  const specs = packages.map((pkg) => {
    // Jobs 0.4.0 and 0.4.1 accept ^0.2.1 || ^0.3.0, excluding standalone Outbox 0.4.
    const version = jobs && pkg.slug === 'outbox' ? '0.3.0' : pkg.version
    return `@nestarc/${pkg.slug}@${version}`
  })

  return `npm install ${specs.join(' ')}`
}
