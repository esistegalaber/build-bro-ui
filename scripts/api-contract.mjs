// Keeps the UI's copy of the API contract and the types generated from it in step with build-bro-api.
//
//   node scripts/api-contract.mjs update   fetch the contract from build-bro-api, regenerate the types
//   node scripts/api-contract.mjs check    fail if the copy differs from build-bro-api's or the types are stale
//
// The contract is fetched from GitHub (both repos are public), from the branch or tag in API_CONTRACT_REF
// (default: main). Use e.g. API_CONTRACT_REF=feature/x while the API change is not merged yet.
import {execFileSync} from 'node:child_process'
import {mkdtempSync, readFileSync, rmSync, writeFileSync} from 'node:fs'
import {tmpdir} from 'node:os'
import {join} from 'node:path'

const CONTRACT = 'api/build-bro-api.yaml'
const TYPES = 'src/app/core/api/build-bro-api.ts'
const REF = process.env.API_CONTRACT_REF || 'main'
const SOURCE = `https://raw.githubusercontent.com/esistegalaber/build-bro-api/${REF}/src/main/resources/openapi/build-bro-api.yaml`

async function upstreamContract() {
  const response = await fetch(SOURCE)
  if (!response.ok) {
    throw new Error(`Could not fetch the contract (${response.status}): ${SOURCE}`)
  }
  return response.text()
}

/** Runs openapi-typescript on the given contract file and returns the generated source. */
function generateTypes(contractFile) {
  const dir = mkdtempSync(join(tmpdir(), 'api-types-'))
  try {
    const out = join(dir, 'types.ts')
    try {
      execFileSync(process.execPath, ['node_modules/openapi-typescript/bin/cli.js', contractFile, '-o', out], {stdio: ['ignore', 'ignore', 'pipe']})
    } catch (error) {
      console.error(`openapi-typescript could not read ${contractFile}:\n${error.stderr}`)
      process.exit(1)
    }
    return readFileSync(out, 'utf8')
  } finally {
    rmSync(dir, {recursive: true, force: true})
  }
}

async function update() {
  writeFileSync(CONTRACT, await upstreamContract())
  writeFileSync(TYPES, generateTypes(CONTRACT))
  console.log(`Updated ${CONTRACT} from build-bro-api@${REF} and regenerated ${TYPES}.`)
}

async function check() {
  const problems = []
  if (readFileSync(CONTRACT, 'utf8') !== await upstreamContract()) {
    problems.push(`${CONTRACT} differs from build-bro-api@${REF}`)
  }
  if (readFileSync(TYPES, 'utf8') !== generateTypes(CONTRACT)) {
    problems.push(`${TYPES} is not generated from ${CONTRACT}`)
  }
  if (problems.length > 0) {
    console.error(`API contract out of date:\n  - ${problems.join('\n  - ')}\nRun \`npm run api:update\` and fix what no longer compiles.`)
    process.exit(1)
  }
  console.log(`${CONTRACT} matches build-bro-api@${REF}, ${TYPES} is up to date.`)
}

const command = process.argv[2]
if (command === 'update') {
  await update()
} else if (command === 'check') {
  await check()
} else {
  console.error('Usage: node scripts/api-contract.mjs update|check')
  process.exit(2)
}
