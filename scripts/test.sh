#!/usr/bin/env bash
set -euo pipefail

script_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
repository_root="$(dirname "$script_dir")"
frontend_path="$repository_root/src/frontend"
solution_path="$repository_root/dotnet-agentic-poc.slnx"

if ! command -v dotnet >/dev/null 2>&1; then
    printf '%s\n' 'dotnet is required but was not found on PATH.' >&2
    exit 127
fi

if ! command -v npm >/dev/null 2>&1; then
    printf '%s\n' 'npm is required but was not found on PATH.' >&2
    exit 127
fi

printf '%s\n' 'Testing backend...'
dotnet test "$solution_path"

printf '%s\n' 'Installing frontend dependencies...'
npm --prefix "$frontend_path" ci

printf '%s\n' 'Testing frontend...'
npm --prefix "$frontend_path" test -- --watch=false
