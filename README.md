# Build Bruh UI

[![Build](https://github.com/esistegalaber/build-bro-ui/actions/workflows/build.yml/badge.svg?branch=main)](https://github.com/esistegalaber/build-bro-ui/actions/workflows/build.yml) [![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=esistegalaber_build-bro-ui&metric=alert_status)](https://sonarcloud.io/summary/overall?id=esistegalaber_build-bro-ui) [![Coverage](https://sonarcloud.io/api/project_badges/measure?project=esistegalaber_build-bro-ui&metric=coverage)](https://sonarcloud.io/summary/overall?id=esistegalaber_build-bro-ui) [![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=esistegalaber_build-bro-ui&metric=sqale_rating)](https://sonarcloud.io/summary/overall?id=esistegalaber_build-bro-ui) [![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=esistegalaber_build-bro-ui&metric=reliability_rating)](https://sonarcloud.io/summary/overall?id=esistegalaber_build-bro-ui) [![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=esistegalaber_build-bro-ui&metric=security_rating)](https://sonarcloud.io/summary/overall?id=esistegalaber_build-bro-ui) [![Bugs](https://sonarcloud.io/api/project_badges/measure?project=esistegalaber_build-bro-ui&metric=bugs)](https://sonarcloud.io/summary/overall?id=esistegalaber_build-bro-ui) [![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=esistegalaber_build-bro-ui&metric=vulnerabilities)](https://sonarcloud.io/summary/overall?id=esistegalaber_build-bro-ui) [![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=esistegalaber_build-bro-ui&metric=code_smells)](https://sonarcloud.io/summary/overall?id=esistegalaber_build-bro-ui) [![Technical Debt](https://sonarcloud.io/api/project_badges/measure?project=esistegalaber_build-bro-ui&metric=sqale_index)](https://sonarcloud.io/summary/overall?id=esistegalaber_build-bro-ui) [![Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=esistegalaber_build-bro-ui&metric=duplicated_lines_density)](https://sonarcloud.io/summary/overall?id=esistegalaber_build-bro-ui) [![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=esistegalaber_build-bro-ui&metric=ncloc)](https://sonarcloud.io/summary/overall?id=esistegalaber_build-bro-ui)

The web frontend for the [Build Bruh API](https://github.com/esistegalaber/build-bro-api). It lets you browse builds and deployments, put builds together into build sets, and manage projects, branches and servers.

Built with Angular 22, NgRx 22, TypeScript 6, Tailwind CSS 4 and daisyUI 5.

## Requirements

- **Node 26** (the Angular 22 CLI also accepts ^22.22.3 and ^24.15; builds and tests are verified on 26). `.nvmrc` pins it, so `nvm use` picks it.
- **Docker**, to build the production image
- To use the app: the Build Bruh API on port 8080

## Getting started

```bash
npm ci
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

**End-to-end tests** live in [build-bro-acceptance](https://github.com/esistegalaber/build-bro-acceptance): Playwright drives this UI against the live API and database, the way a user would.

## Docker

The image builds the app itself, so a clean checkout is enough; no `npm run build` first:

```bash
docker build -t build-bro-ui .
docker run -d --read-only --tmpfs /tmp -p 4200:8080 -e BUILDZ_API=<api host> build-bro-ui
```

- **`BUILDZ_API`** (default `api`) is the API's host name; nginx passes `/api/...` on to `http://${BUILDZ_API}:8080/api/...` and serves the app for every other route.
- **Starts without the API:** the host is looked up per request, so the UI starts even when the API isn't there yet. `/api/...` answers `502` until it is reachable, then works without a restart.
- **Kubernetes:** nginx ignores DNS search domains, so give the full name: `BUILDZ_API=api.<namespace>.svc.cluster.local`.
- **Runs as non-root** (user `101`) on port `8080`, and works with a read-only root filesystem when `/tmp` is writable (`--tmpfs /tmp`).
- **Headers:** a strict Content-Security-Policy (no inline scripts; inline styles are allowed for Angular's component styles), `nosniff`, `Referrer-Policy`, `X-Frame-Options` and `Permissions-Policy`. Text is gzipped; hashed files are cached for a year, `index.html` is always revalidated.

## CI

- **GitHub Actions** (`.github/workflows/build.yml`) runs on pushes to `main` and on pull requests. The unit tests (with coverage) and the production build run as parallel jobs. A third job runs a SonarCloud scan as soon as the unit tests are done, including their coverage (project `esistegalaber_build-bro-ui`, configured in `sonar-project.properties`; needs the `SONAR_TOKEN` repository secret). After the build, the `docker` job builds the image (without pushing it), scans it with Trivy and smoke-tests it against a stub API.
