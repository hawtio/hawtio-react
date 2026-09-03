/* eslint-disable no-console */
// scripts/replace-version.js
//
// Replaces __PACKAGE_VERSION_PLACEHOLDER__ in packages/hawtio/dist/index.js
// with the version declared in packages/hawtio/package.json.
//
// Usage (called automatically via the `replace-version` npm script):
//   node ../../scripts/replace-version.js
//
// The script reads the version from process.env.npm_package_version when
// available (i.e. when invoked through `yarn`/`npm run`), and falls back to
// reading packages/hawtio/package.json directly so it also works standalone.

import { readFileSync, writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const PLACEHOLDER = '__PACKAGE_VERSION_PLACEHOLDER__'

// Resolve paths relative to this script's own location so it works regardless
// of the working directory from which it is invoked.
const __dirname = dirname(fileURLToPath(import.meta.url))
const pkgJsonPath = resolve(__dirname, '../package.json')
const distPath = resolve(__dirname, '../dist/index.js')

const version = process.env.npm_package_version ?? JSON.parse(readFileSync(pkgJsonPath, 'utf8')).version

const original = readFileSync(distPath, 'utf8')

if (!original.includes(PLACEHOLDER)) {
  console.warn(`Warning: "${PLACEHOLDER}" not found in ${distPath} — nothing replaced.`)
  process.exit(0)
}

const replaced = original.replaceAll(PLACEHOLDER, version)
writeFileSync(distPath, replaced, 'utf8')
console.log(`Replaced ${PLACEHOLDER} → ${version} in ${distPath}`)
