---
description: "Developer tooling published under the @nestarc scope, separated from the core SaaS backend package lineup."
---

<script setup>
import ToolCatalogTable from '../.vitepress/theme/components/ToolCatalogTable.vue'
</script>

# Tooling

Tooling packages support safer development workflows around the NestJS modules and adjacent infrastructure. They are published under the same `@nestarc` npm scope, but they are intentionally separated from the SaaS backend package lineup.

## Labs

<ToolCatalogTable view="tools" />

## Why separate tooling?

Core packages are NestJS modules that run inside production SaaS backends. Labs tooling can still be useful in production-adjacent workflows, but it does not belong in the SaaS module adoption path until its long-term fit is clear.

Start with [mcp-guard](/tools/mcp-guard/) if you connect MCP servers to AI coding tools, agents, or local development environments.
