# Build Bro UI

The web frontend for the [Build Bro API](https://github.com/esistegalaber/build-bro-api). It lets you browse builds and deployments, put builds together into build sets, and manage projects, branches and servers.

Built with Angular 22, NgRx 22, TypeScript 6, Tailwind CSS 4 and daisyUI 5.

## Requirements

- **Node 26** (the Angular 22 CLI also accepts ^22.22.3 and ^24.15; builds and tests are verified on 26)
- **Chrome**, for the end-to-end tests
- **Docker**, to build the production image
- For the live tests: the Build Bro API on port 8080, with `testdata.sql` loaded into its database

## Getting started

```bash
npm ci        # also downloads the Cypress binary (approved in package.json -> allowScripts)
npm start     # dev server on http://localhost:4200, proxies /api to http://localhost:8080
```

`npm run start-iso` starts the dev server without the API proxy.

## Build

```bash
npm run build   # production build in dist/build-bro-ui/browser
npm run watch   # development build in watch mode
```

## Tests

**Unit tests** (Vitest) cover the app's logic: reducers, selectors, effects, guards, pipes and services. They run in a few seconds without a browser or backend:

```bash
npm test                                  # watch mode
npm test -- --watch=false --coverage      # once, with a coverage report in coverage/
```

**End-to-end tests** (Cypress) in `cypress/e2e/` cover every page. They need the app on :4200 (`npm start`) and can run in two modes:

```bash
npm run cypress:run        # against an in-memory fake API, no backend needed
npm run cypress:run:live   # against the real API on :8080 (needs testdata.sql loaded)
npm run cypress:open       # interactive Cypress
```

The fake API (`cypress/support/fake-api.ts`) serves a snapshot of the real API with `testdata.sql` loaded (`cypress/fixtures/api-db.json`). Every test starts with a fresh copy of the data. When `testdata.sql` changes, reload it into the database and regenerate the snapshot with `npm run cypress:snapshot-api`.

The tests that change data clean up after themselves, so live mode can be run again on the same database.

After upgrading Cypress, run `npm approve-scripts cypress` so that `npm ci` keeps downloading its binary.

## Docker

The `Dockerfile` packages the production build into an nginx image, so build the app first:

```bash
npm run build
docker build -t build-bro-ui .
docker run -p 4200:80 -e BUILDZ_API=<api host> build-bro-ui
```

nginx proxies `/api` to `http://${BUILDZ_API}:8080/api` (`BUILDZ_API` defaults to `api`) and serves `index.html` for all other routes.

## CI

- **GitHub Actions** (`.github/workflows/build.yml`) runs on pushes to `main` and on pull requests. The unit tests (with coverage) and the build with the e2e tests (in Chrome, against the fake API) run as parallel jobs. A third job runs a SonarCloud scan as soon as the unit tests are done, including their coverage (project `esistegalaber_build-bro-ui`, configured in `sonar-project.properties`; needs the `SONAR_TOKEN` repository secret).
