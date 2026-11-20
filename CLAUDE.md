# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Build Bro UI is an Angular 16 single-page app with NgRx 16 and Tailwind/daisyUI. Builds and tests are verified on Node 18 (`nvm use 18`), which is also what the Jenkinsfile uses. It is the frontend for the Build Bro REST API (the sibling repo `../build-bro-api`, Spring Boot on port 8080). It browses builds, build sets, projects, servers and deployments.

## Commands

```bash
npm start              # ng serve on :4200, proxies /api -> http://[::1]:8080 (proxy.conf.json)
npm run start-iso      # ng serve without the proxy
npm run build          # production build to dist/build-bro-ui
npm run watch          # development build in watch mode
npm run cypress:run        # headless e2e tests against the fake API (needs only the app on :4200)
npm run cypress:run:live   # same specs against the real API on :8080 (needs testdata.sql loaded)
npm run cypress:open       # interactive Cypress
npx cypress run --spec cypress/e2e/builds-page.cy.ts   # single e2e spec
npm run cypress:snapshot-api   # regenerate cypress/fixtures/api-db.json from a running API
```

No linter is configured (there is no `ng lint` target and no ESLint). There is no unit test setup (Karma/Jasmine was removed, so there is no `ng test`), and no Cypress component specs, even though `cypress.config.ts` has a `component` section. Cypress is pinned to an exact version in `devDependencies`. The Cypress e2e tests in `cypress/e2e/` (one spec per page) are the only tests.

**Two e2e modes.** By default, `cypress/support/e2e.ts` installs an in-memory **fake API** (`cypress/support/fake-api.ts`) before every test. It serves `cypress/fixtures/api-db.json`, a snapshot of the real API with `testdata.sql` loaded, and implements search, filtering, sorting (ties by ascending id, like the API), paging and the mutations. Every test gets a fresh copy of the data. Any `/api` call it doesn't stub gets a 501, so **a new endpoint needs a stub in `fake-api.ts`**. Specs use `cy.intercept(...).as(...)` without handlers only to wait on and inspect requests; those fall through to the fake. With `CYPRESS_LIVE=true` (`cypress:run:live`) the fake is skipped and the specs call the real API. The tests that change data clean up after themselves, so live mode can be re-run on the same database. When `testdata.sql` changes, reload it into the DB and run `cypress:snapshot-api`. Cypress's bundled webpack can't parse `?.`/`??` in spec and support files.

The `Jenkinsfile` shows how to set up live mode: MariaDB container, then the `esistegalaber/build-bruh-api` image, then `testdata.sql` piped into the DB. It still calls `npm run cypress:run`, which is now the stubbed mode; switch it to `cypress:run:live` to test against that API. CI also runs on GitHub Actions (`.github/workflows/build.yml`: Cypress plus a SonarCloud scan). That workflow does **not** load `testdata.sql`, so it should use the stubbed mode. Elements are selected with `data-cy-id` attributes, so keep them when editing templates.

## Architecture

- **Standalone components, no NgModules.** `src/main.ts` bootstraps `AppComponent` with `bootstrapApplication` and registers the root store slices (`alert`, `stats`, `nav`, `projects`, `servers`) and their effects. `app.routes.ts` lazy-loads one `*.routes.ts` per feature folder.
- **Feature folders** (`builds/`, `build-sets/`, `build-set-edit/`, `deployments/`, `projects/`, `servers/`, `home/`) follow this pattern, though not every folder has every part. `projects/`, `servers/` and `home/` have no `state/` and read the root slices (`projects`, `servers`, `stats`). `build-sets/` has no `ui/` and uses `src/app/ui/build-sets/`.
  - `*.page.ts` is the routed container component. It selects from the store and dispatches actions.
  - `ui/` holds presentational components with `@Input`/`@Output`.
  - `state/` holds the NgRx actions, reducer, selectors and effects. These are registered **lazily in the feature's route `providers`** via `StoreModule.forFeature` / `EffectsModule.forFeature` (see `builds/builds.routes.ts`), not in `main.ts`.
- **Shared code**: `src/app/ui/` holds presentational components reused across features (accordions, paginator, nav, alert panel). `src/app/core/` holds the shared model interfaces (`core/state/model.ts`), root-level state slices and pipes. Import shared things through the `core/index.ts` barrel.
- **HTTP lives only in effects** (and some route guards). They call relative `/api/v1/...` URLs with `HttpClient`, and failures map to `AlertActions.backendErrorOccurred`. The global alert reducer reads the backend's error shape (`error.message` / `error.description`, from the API's `IExceptionInfo`).
- **Route guards load data**: in `build-set-edit`, the `new` / `:build-set-name` / `clone/:build-set-name` guards dispatch load actions and always return `true`.
- **Templates are inline**, styled with Tailwind utility classes plus daisyUI component classes. Components use `OnPush` change detection. Store values are often passed through the `deepClone` pipe (`CloningPipe`) before reaching forms, so forms never mutate frozen store state.
- Model interfaces in `core/state/model.ts` mirror the API DTOs (`IBuild`, `IBuildSearchResult`, …). Keep them in sync with `build-bro-api`'s `api.model` package.

## Deployment

The `Dockerfile` packages a prebuilt `dist/build-bro-ui` into nginx, so run `npm run build` first. `default.conf.template` proxies `/api` to `http://${BUILDZ_API}:8080/api` (env var `BUILDZ_API`, default `api`) and falls back to `index.html` for SPA routing.
