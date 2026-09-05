<script setup>
import { getPackage } from '../../../data/package-catalog.mjs'

const compatibility = [
  { slug: 'api-keys', prismaMajors: '5, 6, 7', prisma7Status: 'Verified packed consumer and PostgreSQL storage lane' },
  { slug: 'rbac', prismaMajors: '5, 6, 7', prisma7Status: 'Verified packed consumer and PostgreSQL storage lane' },
  { slug: 'outbox', prismaMajors: '5, 6, 7', prisma7Status: 'Verified packed consumer and PostgreSQL storage lane' },
  { slug: 'webhook', prismaMajors: '5, 6, 7', prisma7Status: 'Verified packed consumer and PostgreSQL storage lane' },

  {
    slug: 'tenancy',
    prismaMajors: '6, 7',
    prisma7Status: 'Primary development and E2E target',
  },
  {
    slug: 'soft-delete',
    prismaMajors: '5, 6, 7',
    prisma7Status: 'Primary development and PostgreSQL E2E target',
  },
  {
    slug: 'audit-log',
    prismaMajors: '5, 6, 7',
    prisma7Status: 'Primary development and CI target',
  },
  {
    slug: 'feature-flag',
    prismaMajors: '7',
    prisma7Status: 'Required Prisma major',
  },
  {
    slug: 'pagination',
    prismaMajors: '5, 6, 7',
    prisma7Status: 'Primary development and CI target',
  },
]

const rows = compatibility.map((entry) => {
  const pkg = getPackage(entry.slug)
  if (!pkg) throw new Error(`Unknown package catalog slug: ${entry.slug}`)
  return { ...entry, pkg }
})
</script>

<template>
  <table aria-label="Prisma compatibility by package" data-catalog-surface="prisma-compatibility" tabindex="0">
    <thead>
      <tr>
        <th scope="col">Package</th>
        <th scope="col">Release</th>
        <th scope="col">Supported Prisma majors</th>
        <th scope="col">Prisma 7 status</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="row in rows"
        :key="row.slug"
        data-catalog-surface="prisma-compatibility"
        :data-catalog-package="row.pkg.slug"
        :data-version="row.pkg.version"
        :data-status="row.pkg.supportStatus"
      >
        <td><a :href="`/packages/${row.pkg.slug}/`"><code>@nestarc/{{ row.pkg.slug }}</code></a></td>
        <td><code>{{ row.pkg.version }}</code></td>
        <td>{{ row.prismaMajors }}</td>
        <td>{{ row.prisma7Status }}</td>
      </tr>
    </tbody>
  </table>
</template>
