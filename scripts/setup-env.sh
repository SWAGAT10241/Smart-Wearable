#!/usr/bin/env bash
# Sets up .env files from templates across all subsystems
set -e

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "==> Setting up environment files..."

for dir in backend frontend mobile; do
  if [ -f "$ROOT_DIR/$dir/.env.example" ] && [ ! -f "$ROOT_DIR/$dir/.env" ]; then
    cp "$ROOT_DIR/$dir/.env.example" "$ROOT_DIR/$dir/.env"
    echo "  [Created] $dir/.env"
  else
    echo "  [Skipped] $dir/.env already exists"
  fi
done

echo "==> Environment setup complete."
