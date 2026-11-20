# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Build Bro UI is an Angular 15 single-page app with NgRx and Tailwind/daisyUI. It is the frontend for the Build Bro REST API (the sibling repo `../build-bro-api`, Spring Boot on port 8080). It browses builds, build sets, projects, servers and deployments.

## Commands

```bash
npm start              # ng serve on :4200, proxies /api -> http://[::1]:8080 (proxy.conf.json)
npm run start-iso      # ng serve without the proxy
npm run build          # production build to dist/build-bro-ui
npm run watch          # development build in watch mode
npm run cypress:run    # headless e2e tests (expects the app on :4200)
npm run cypress:open   # interactive Cypress
npx cypress run --spec cypress/e2e/builds-page.cy.ts   # single e2e spec
```

No linter is configured (there is no `ng lint` target and no ESLint). There are no Karma/Jasmine unit specs, even though `ng test` is configured, and no Cypress component specs, even though `cypress.config.ts` has a `component` section. The Cypress e2e tests in `cypress/e2e/` are the only tests. They call the **real** backend: `cy.intercept` only waits on requests and does not stub them, and the files in `cypress/fixtures` are not wired in. Assertions such as `build-10`, `build-81` and project `backoffice` depend on the API running on :8080 with `testdata.sql` (in this repo root) loaded into its MariaDB. The `Jenkinsfile` shows the full setup: MariaDB container, then the `esistegalaber/build-bruh-api` image, then `testdata.sql` piped into the DB, then `npm run cypress:run`. CI also runs on GitHub Actions (`.github/workflows/build.yml`: Cypress plus a SonarCloud scan). That workflow does **not** load `testdata.sql`, so data-dependent assertions only hold under the Jenkins-style setup. Elements are selected with `data-cy-id` attributes, so keep them when editing templates.

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
