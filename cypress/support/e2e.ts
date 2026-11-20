// Loaded before every e2e spec (see supportFile in cypress.config.ts).
//
// By default the specs run against the in-memory fake API in ./fake-api.ts, so no backend is needed.
// Set CYPRESS_LIVE=true (npm run cypress:run:live) to run them against the real API on :8080
// instead, which needs testdata.sql loaded into its database.
import {installFakeApi} from './fake-api'

export function isLive(): boolean {
  const live = Cypress.env('LIVE')
  return live === true || live === 'true'
}

beforeEach(() => {
  if (!isLive()) {
    installFakeApi()
  }
})
