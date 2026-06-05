---
description: "Developer tooling published under the @nestarc scope, separated from the core SaaS backend package lineup."
---

# Tooling

Tooling packages support safer development workflows around the NestJS modules and adjacent infrastructure. They are published under the same `@nestarc` npm scope, but they are intentionally separated from the 13 SaaS backend packages.

## Labs

| Tool | Version | Purpose | Docs |
|------|---------|---------|------|
| `@nestarc/mcp-guard` | `0.2.0` | Static security scanner for MCP servers and MCP client configuration files. | [mcp-guard](/tools/mcp-guard/) |

## Why separate tooling?

Core packages are NestJS modules that run inside production SaaS backends. Labs tooling can still be useful in production-adjacent workflows, but it does not belong in the SaaS module adoption path until its long-term fit is clear.

Start with [mcp-guard](/tools/mcp-guard/) if you connect MCP servers to AI coding tools, agents, or local development environments.
