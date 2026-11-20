#!/usr/bin/env bash
# Runs test & verification suites across all 4 tiers
set -e

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "==> 1/4 Testing Backend..."
(cd "$ROOT_DIR/backend" && pnpm test)

echo "==> 2/4 Testing Frontend..."
(cd "$ROOT_DIR/frontend" && pnpm run test:run)

echo "==> 3/4 Verifying Mobile..."
(cd "$ROOT_DIR/mobile" && node scripts/check-syntax.js)

echo "==> 4/4 Verifying Hardware Python toolchain..."
python3 -m compileall -q "$ROOT_DIR/hardware"

echo "==> All 4 tiers verified successfully!"
