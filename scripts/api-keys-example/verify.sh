#!/usr/bin/env bash
# Verify the exact downloadable archive against an isolated PostgreSQL instance.
set -euo pipefail
root="$(cd "$(dirname "$0")/../.." && pwd)"
python3 "$root/scripts/api-keys-example/package.py" --check
scratch="$(mktemp -d "${TMPDIR:-/tmp}/api-keys-040.XXXXXXXX")"
container="nestarc-api-keys-$(basename "$scratch" | tr '[:upper:]' '[:lower:]' | tr '.' '-')"
cleanup() {
  docker rm -f "$container" >/dev/null 2>&1 || true
  rm -rf "$scratch"
}
trap cleanup EXIT INT TERM
unzip -q "$root/public/examples/api-keys-0.4.0.zip" -d "$scratch"
docker run -d --name "$container" \
  -e POSTGRES_USER=demo -e POSTGRES_PASSWORD=demo -e POSTGRES_DB=api_keys_demo \
  -p 127.0.0.1::5432 --tmpfs /var/lib/postgresql/data postgres:15-alpine >/dev/null
for attempt in $(seq 1 30); do
  if docker exec "$container" pg_isready -U demo -d api_keys_demo >/dev/null 2>&1; then break; fi
  sleep 1
done
docker exec "$container" pg_isready -U demo -d api_keys_demo >/dev/null
port="$(docker port "$container" 5432/tcp | sed 's/.*://')"
export DATABASE_URL="postgresql://demo:demo@127.0.0.1:$port/api_keys_demo?schema=public"
export API_KEY_PEPPER="$(node -e 'process.stdout.write(require("node:crypto").randomBytes(32).toString("hex"))')"
export DEMO_ADMIN_TOKEN_A="$(node -e 'process.stdout.write(require("node:crypto").randomBytes(32).toString("hex"))')"
export DEMO_ADMIN_TOKEN_B="$(node -e 'process.stdout.write(require("node:crypto").randomBytes(32).toString("hex"))')"
cd "$scratch/api-keys-quick-start"
npm ci --strict-peer-deps --cache "$scratch/npm-cache"
npm run db:setup
npm run smoke
node -e 'const p=JSON.parse(require("node:fs").readFileSync("./node_modules/@nestarc/api-keys/package.json", "utf8")); console.log(JSON.stringify({artifact:"public/examples/api-keys-0.4.0.zip", apiKeys:p.version, result:"passed"}))'
