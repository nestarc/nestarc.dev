<script setup>
import ApiCatalogTable from '../.vitepress/theme/components/ApiCatalogTable.vue'
import ToolCatalogTable from '../.vitepress/theme/components/ToolCatalogTable.vue'
</script>

# API Reference

API reference entry point for current nestarc SaaS packages, plus separate tooling docs.

::: info
All package references are generated from the matching published release tag. This documentation status is separate from package support status; see the [package comparison](/packages/) for `Supported` and `Preview` definitions.
:::

## Packages

<ApiCatalogTable />

## Tooling

<ToolCatalogTable view="api" />

## Generation policy

The weekly workflow uses:

- the exact package versions declared by the shared package catalog;
- the corresponding immutable `v<version>` Git tags;
- a lockfile-pinned TypeDoc, Markdown plugin, and TypeScript toolchain;
- entry-page and relative-link validation before the site build and commit.

Labs tooling remains separate from the SaaS package API surface.
