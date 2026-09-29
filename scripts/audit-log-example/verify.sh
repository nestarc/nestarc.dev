#!/usr/bin/env bash
# Verify the exact downloadable archive in a temporary directory and database.
set -euo pipefail
root="$(cd "$(dirname "$0")/../.." && pwd)"
python3 "$root/scripts/audit-log-example/package.py" --check
scratch="$(mktemp -d "${TMPDIR:-/tmp}/audit-log-070.XXXXXXXX")"
container="nestarc-audit-070-$(basename "$scratch" | tr '[:upper:]' '[:lower:]' | tr '.' '-')"
cleanup() {
  docker rm -f "$container" >/dev/null 2>&1 || true
  rm -rf "$scratch"
}
trap cleanup EXIT INT TERM
unzip -q "$root/public/examples/audit-log-0.7.0.zip" -d "$scratch"
docker run -d --name "$container" \
  -e POSTGRES_USER=test -e POSTGRES_PASSWORD=test -e POSTGRES_DB=audit_test \
  -p 127.0.0.1::5432 --tmpfs /var/lib/postgresql/data postgres:16-alpine >/dev/null
for attempt in $(seq 1 30); do
  if docker exec "$container" pg_isready -U test -d audit_test >/dev/null 2>&1; then break; fi
  sleep 1
done
docker exec "$container" pg_isready -U test -d audit_test >/dev/null
port="$(docker port "$container" 5432/tcp | sed 's/.*://')"
schema="audit_docs_$(node -e 'process.stdout.write(require("node:crypto").randomBytes(16).toString("hex"))')"
export DATABASE_URL="postgresql://test:test@127.0.0.1:$port/audit_test?schema=$schema"
cd "$scratch/audit-log-quick-start"
npm ci --strict-peer-deps
npm run db:setup
npm run smoke:manual
npm run smoke
npm run smoke:policies
node -e 'const p=require("./node_modules/@nestarc/audit-log/package.json"); console.log(JSON.stringify({artifact:"public/examples/audit-log-0.7.0.zip", auditLog:p.version, result:"passed"}))'
