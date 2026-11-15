# Maintain the customer API keys example

The source lives in `examples/api-keys-quick-start/`. Its public download is
`public/examples/api-keys-0.4.0.zip`. Keep the source, lockfile, blog commands,
and archive synchronized.

```sh
python3 scripts/api-keys-example/package.py
python3 scripts/api-keys-example/package.py --check
bash scripts/api-keys-example/verify.sh
npm run docs:check
```

The verifier requires a compatible Node.js runtime, npm, Python 3, unzip, and
Docker. It unpacks the exact download into a temporary directory, installs the
locked registry dependencies with strict peer checks, applies migrations, and
runs the HTTP assertions against a disposable PostgreSQL 15 container. It uses
an automatically assigned loopback port and removes its container and temporary
files on exit. No production credentials or databases are needed.

The archive is deterministic and excludes local secrets, installed dependencies,
generated Prisma clients, and compiled output. The example workflow verifies it
when the source, archive, article, or maintenance scripts change.
