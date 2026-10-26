# Maintain the downloadable audit-log example

Source: `examples/audit-log-quick-start`. Download: `public/examples/audit-log-0.8.0.zip`.

After editing source, run from the site root:

```sh
python3 scripts/audit-log-example/package.py
python3 scripts/audit-log-example/package.py --check
bash scripts/audit-log-example/verify.sh
```

Packaging is deterministic and excludes local environment, dependencies, generated
Prisma clients and compiled output. The check also verifies the package and lockfile
pin the published registry package to 0.8.0.

Verification requires Docker, Python 3, `unzip`, Node.js 22.23.4+ within 22.x or 24.22.1+ within 24.x, and registry
access. It extracts the exact archive outside the repository, installs from the lock
with strict peers, starts its own PostgreSQL 16 container on an ephemeral loopback
port, creates a random isolated schema, and runs setup, compilation, manual, HTTP,
policy smokes, and the 0.8.0 product-quality smoke (generated Prisma typing, managed
transactions, caught validation rollback, diagnostics, and provider capabilities). Its trap removes only its own container and directory.

The Prisma 7.9.1 CLI brings npm advisory findings for `deepmerge-ts` and `mysql2`.
Prisma 7.10.0 still pins the same affected versions; the example does not force a
major-version transitive override or downgrade Prisma. Nest 12.1.1 uses patched
Multer 2.4.0. Revisit Prisma tooling dependencies when an upstream fix is available.
