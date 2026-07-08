#!/usr/bin/env bash
set -euo pipefail

npm install
npm run prisma:generate -w @mikyasos/api
