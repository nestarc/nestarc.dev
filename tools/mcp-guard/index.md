---
title: "MCP Configuration Security Scanner - mcp-guard"
description: "mcp-guard is a static security scanner for MCP servers and MCP client configuration files."
---

# MCP Configuration Security Scanner - mcp-guard

`@nestarc/mcp-guard` is a static security scanner for MCP servers and MCP client configuration files. It is part of [Nestarc Labs tooling](/tools/), separate from the SaaS backend packages.

[Source code](https://github.com/nestarc/mcp-guard) · [npm package](https://www.npmjs.com/package/@nestarc/mcp-guard)

Use it before connecting MCP servers to AI coding tools, agents, or local development environments. It highlights risky permissions, shell commands, remote endpoints, container settings, broad filesystem access, and secret-like environment variables or headers.

::: info Labs tool
`mcp-guard` is intentionally separated from the main NestJS package lineup. It supports safer development workflows around MCP, but it is not a NestJS SaaS backend module.
:::

## Install

Requires Node.js >= 20.

```bash
npm install -g @nestarc/mcp-guard
```

Or run directly:

```bash
npx @nestarc/mcp-guard scan ./mcp.json
```

## Usage

```bash
mcp-guard scan ./mcp.json
mcp-guard scan ./mcp.json --json
mcp-guard scan ./mcp.json --fail-on high
mcp-guard scan ./mcp.json --quiet --no-color
mcp-guard scan --all
mcp-guard scan --all --client cursor
mcp-guard scan --all --scope project
mcp-guard scan --all --list-targets
```

## Discovery mode

`mcp-guard scan --all` scans known common MCP configuration locations for the current project and user profile. Missing files are ignored, files are never executed, and only readable local configuration files are scanned.

| Client | Scope | Common locations |
|--------|-------|------------------|
| Cursor | Project/User | `.cursor/mcp.json`, `~/.cursor/mcp.json` |
| VS Code | Project/User | `.vscode/mcp.json`, user `Code/User/mcp.json` |
| Claude Code | Project/User | `.mcp.json`, `~/.claude.json` |
| Claude Desktop | User | `Claude/claude_desktop_config.json`, `Claude/config.json` |

## Options

| Option | Description |
|--------|-------------|
| `--json` | Output machine-readable JSON. |
| `--fail-on <level>` | Exit with code 1 when a finding reaches `info`, `low`, `medium`, `high`, or `critical`. |
| `--no-color` | Disable colored terminal output. |
| `--quiet` | Print only the summary in text mode. |
| `--all` | Discover and scan known MCP configuration files. |
| `--client <name>` | Limit discovery to `cursor`, `vscode`, `claude-code`, or `claude-desktop`. |
| `--scope <scope>` | Limit discovery to `project`, `user`, or `all`. |
| `--list-targets` | Print discovered targets and exit without scanning. |

## Rules

| Rule | Severity | What it checks |
|------|----------|----------------|
| `MCPG001` | High/Medium | Secret-like environment variables and headers. |
| `MCPG002` | High | Shell interpreters used as commands. |
| `MCPG003` | Medium | Dynamic package runners such as `npx`, `pnpx`, `bunx`, `uvx`, and `dlx`. |
| `MCPG004` | Medium | Plain HTTP transport. |
| `MCPG005` | High | Broad filesystem access such as `/`, `~`, home directories, and parent traversal. |
| `MCPG006` | High | Container runtime arguments that grant elevated host access. |
| `MCPG007` | Critical | Suspicious shell patterns such as pipe-to-shell installers, `rm -rf`, and `chmod +x`. |
| `MCPG008` | Low | Public HTTPS remote endpoints. |
| `MCPG009` | Info | Server entries missing both `command` and `url`. |

## From finding to fix

| Finding | Safer next step |
|---------|-----------------|
| `MCPG004`: plain HTTP transport | Use HTTPS for remote servers, or a trusted local `stdio` command when the server runs on the same machine. |
| `MCPG005`: broad filesystem access | Replace home-directory or root access with the smallest project-specific directory the server actually needs. |
| `MCPG002` / `MCPG007`: shell wrapper or dangerous shell pattern | Invoke a reviewed, pinned executable directly and remove shell pipelines or destructive command fragments. |

Treat each result as a review prompt: confirm why the permission is needed, narrow it where possible, and rescan the configuration before connecting the server.

## CI

Use an explicit config path when your repo stores MCP config in a known location:

```bash
npx @nestarc/mcp-guard scan ./.cursor/mcp.json --fail-on high
```

Use discovery mode when CI should scan whichever project-level MCP config exists:

```bash
npx @nestarc/mcp-guard scan --all --scope project --fail-on high
```

## Limitations

`mcp-guard` is a static scanner. It does not certify an MCP server as safe, execute the server during scans, inspect fetched packages, or verify remote services. Review findings in context before deciding whether to trust a server.
