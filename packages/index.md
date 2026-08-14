---
description: "Compare all current nestarc SaaS packages by adoption stage, support status, version, and operating use case."
---

<script setup>
import AdoptionPathTable from '../.vitepress/theme/components/AdoptionPathTable.vue'
import CatalogScopeSummary from '../.vitepress/theme/components/CatalogScopeSummary.vue'
import PackageMatrixSections from '../.vitepress/theme/components/PackageMatrixSections.vue'
import ToolCatalogTable from '../.vitepress/theme/components/ToolCatalogTable.vue'
</script>

# Packages

nestarc publishes independent NestJS packages for production SaaS backends. Install only the modules that solve the problem in front of you, then add the next layer when the product needs it.

::: info Current scope
<CatalogScopeSummary />
:::

## Status model

| Status | Meaning |
|--------|---------|
| Supported | Actively maintained package with documented compatibility coverage and operating guidance. |
| Preview | Published package with an evolving API or operating contract; validate it against your production requirements. |
| Labs | Experimental or developer tooling outside the SaaS backend package lineup. |

::: warning Version and status are different signals
All current packages are pre-1.0. `Supported` describes active maintenance and compatibility coverage; it does not promise a frozen API. Review the package changelog and migration notes before upgrading.
:::

## Recommended adoption path

<AdoptionPathTable />

See the [Adoption Roadmap](/guide/adoption-roadmap) for the detailed sequence.

## Package matrix

<PackageMatrixSections />

## Tooling

<ToolCatalogTable view="packages" />

## Install pattern

Each package can be installed by name:

```bash
npm install @nestarc/tenancy
```

Replace `tenancy` with the package you want to adopt. Package-specific peer dependencies and setup steps are listed in each package's Installation page.
