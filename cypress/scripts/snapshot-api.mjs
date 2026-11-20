#!/usr/bin/env node
// Snapshots the data of a running Build Bro API into cypress/fixtures/api-db.json,
// which the fake API in cypress/support/fake-api.ts serves when the e2e tests run stubbed.
//
// Usage (API on :8080 with testdata.sql freshly loaded):
//   node cypress/scripts/snapshot-api.mjs [http://localhost:8080]
import {writeFileSync} from 'node:fs'
import {dirname, join} from 'node:path'
import {fileURLToPath} from 'node:url'

const base = `${process.argv[2] || 'http://localhost:8080'}/api/v1`
const out = join(dirname(fileURLToPath(import.meta.url)), '..', 'fixtures', 'api-db.json')

async function call(path, body) {
  const response = await fetch(`${base}${path}`, body === undefined ? {} : {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(body)
  })
  if (!response.ok) {
    throw new Error(`${path}: HTTP ${response.status}`)
  }
  return response.json()
}

const allBuilds = await call('/builds/search', {
  project: '', branch: '', labels: {}, minBuildNumber: null, maxBuildNumber: null,
  page: 0, pageSize: 10000, sortAttribute: 'id', sortDirection: 'ASC'
})
const allDeployments = await call('/deployments/search', {
  serverName: '', page: 0, pageSize: 10000, sortAttribute: 'id', sortDirection: 'ASC'
})
const buildSetNames = await call('/build-sets/names')
const buildSetTemplates = []
for (const name of buildSetNames) {
  buildSetTemplates.push(await call(`/build-sets/${encodeURIComponent(name)}`))
}

const db = {
  stats: await call('/stats'),
  searchData: await call('/search-data'),
  projects: await call('/projects'),
  servers: await call('/servers'),
  builds: allBuilds.data,
  deployments: allDeployments.data,
  buildSetTemplates
}

writeFileSync(out, JSON.stringify(db, null, 2) + '\n')
console.log(`Wrote ${out}: ${db.builds.length} builds, ${db.deployments.length} deployments, ` +
  `${db.buildSetTemplates.length} build set templates, ${db.projects.length} projects, ${db.servers.length} servers`)
