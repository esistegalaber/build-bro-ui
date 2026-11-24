// An in-memory fake of the Build Bruh REST API, served through cy.intercept.
//
// It is installed before every test (see ./e2e.ts) unless the tests run in live mode
// (CYPRESS_LIVE=true). Its data comes from fixtures/api-db.json, a snapshot of the real API
// with testdata.sql loaded (regenerate it with cypress/scripts/snapshot-api.mjs). Every test
// gets a fresh copy, so changes made by one test (saving a build set, renaming a server, ...)
// never leak into the next one.
//
// Spec-level `cy.intercept(...).as(...)` calls without a handler still work: newer intercepts
// run first and, when they don't reply, hand the request on to these stubs.

// Typed with the API models, which come from the build-bro-api contract (see src/app/core/state/model.ts), so a
// stub that answers in a shape the contract doesn't allow fails to compile.
import type {
  IBranch,
  IBuild,
  IBuildSearchParams,
  IBuildSet,
  IBuildSetTemplate,
  IBuildStats,
  IBuildTemplate,
  IDeployment,
  IDeploymentSearch,
  ILabelDefinition,
  ILabelDefinitionChange,
  ILabelSettings,
  ILabelViolation,
  IProject,
  ISearchData,
  IServer
} from '../../src/app/core/state/model'
import {violationOf} from '../../src/app/core/labels/label-values'

interface ApiDb {
  stats: IBuildStats
  searchData: ISearchData
  projects: IProject[]
  servers: IServer[]
  builds: IBuild[]
  deployments: IDeployment[]
  buildSetTemplates: IBuildSetTemplate[]
  labelDefinitions: ILabelDefinition[]
}

/** The paging and sorting fields of a search request, as sent: any of them may be missing. */
type PagedSearch = Partial<Pick<IBuildSearchParams, 'page' | 'pageSize' | 'sortAttribute'>> & { sortDirection?: string }

const API = '/api/v1'

function path(pattern: string): RegExp {
  // matches the path part of the request url exactly, with an optional query string
  return new RegExp(`^[^?]*${API.replace(/\//g, '\\/')}${pattern}(\\?.*)?$`)
}

function lastSegment(url: string): string {
  const pathname = url.split('?')[0]
  return decodeURIComponent(pathname.substring(pathname.lastIndexOf('/') + 1))
}

function notFound(message: string) {
  return {statusCode: 404, body: {key: 'not-found', description: 'No such data', message}}
}

function compare(a: unknown, b: unknown): number {
  if (a === b) {
    return 0
  }
  return (a as number | string) < (b as number | string) ? -1 : 1
}

/** Sorts by the requested attribute, ties by ascending id (what the real API does), then pages. */
function searchResult<T extends { id: number }>(items: T[], search: PagedSearch, defaultSort: string) {
  const sortAttribute = search.sortAttribute || defaultSort
  const direction = String(search.sortDirection || 'DESC').toUpperCase() === 'ASC' ? 1 : -1
  const sorted = [...items].sort((a, b) =>
    direction * compare(a[sortAttribute as keyof T], b[sortAttribute as keyof T]) || compare(a.id, b.id))

  const pageSize = Number(search.pageSize) || 10
  const page = Number(search.page) || 0
  const totalElements = sorted.length
  const totalPages = Math.ceil(totalElements / pageSize)
  return {
    page,
    totalElements,
    totalPages,
    hasNext: page < totalPages - 1,
    hasPrevious: page > 0,
    data: sorted.slice(page * pageSize, (page + 1) * pageSize)
  }
}

function hasLabels(build: IBuild, labels: { [key: string]: string } | undefined): boolean {
  return Object.keys(labels || {}).every((key) =>
    build.labels.some((label) => label.key === key && label.value === labels![key]))
}

/** A number from the request: the UI sends `null` for "no limit", typed input may arrive as text. */
function numberOrNull(value: unknown): number | null {
  return value === null || value === undefined || value === '' ? null : Number(value)
}

function searchBuilds(db: ApiDb, search: Partial<IBuildSearchParams>) {
  const min = numberOrNull(search.minBuildNumber)
  const max = numberOrNull(search.maxBuildNumber)
  const matching = db.builds.filter((build) =>
    (!search.project || build.project === search.project)
    && (!search.branch || build.branch === search.branch)
    && (min === null || build.buildNumber >= min)
    && (max === null || build.buildNumber <= max)
    && hasLabels(build, search.labels))
  return searchResult(matching, search, 'buildNumber')
}

/** The build a build template resolves to: the highest matching build number. */
function resolveBuildTemplates(db: ApiDb, name: string, buildTemplates: IBuildTemplate[]): IBuildSet {
  const builds: { [project: string]: IBuild } = {}
  buildTemplates.forEach((template) => {
    const candidates = db.builds.filter((build) =>
      build.project === template.project
      && build.branch === template.branch
      && (template.buildNumber === null || template.buildNumber === undefined || build.buildNumber === Number(template.buildNumber))
      && hasLabels(build, template.labels))
    if (candidates.length > 0) {
      builds[template.project] = candidates.reduce((best, build) => build.buildNumber > best.buildNumber ? build : best, candidates[0])
    }
  })
  return {name, builds}
}

function findTemplate(db: ApiDb, name: string): IBuildSetTemplate | undefined {
  return db.buildSetTemplates.find((template) => template.name === name)
}

function nextId(items: { id?: number | null }[]): number {
  return items.reduce((max, item) => Math.max(max, item.id || 0), 0) + 1
}

function saveTemplate(db: ApiDb, template: IBuildSetTemplate): IBuildSetTemplate {
  const existing = findTemplate(db, template.name)
  let templateIds = nextId(db.buildSetTemplates.flatMap((t) => t.buildTemplates))
  const saved: IBuildSetTemplate = {
    id: existing ? existing.id : nextId(db.buildSetTemplates),
    name: template.name,
    buildTemplates: (template.buildTemplates || []).map((buildTemplate) => ({
      id: templateIds++,
      project: buildTemplate.project,
      branch: buildTemplate.branch,
      buildNumber: buildTemplate.buildNumber === undefined ? null : buildTemplate.buildNumber,
      labels: buildTemplate.labels || {}
    }))
  }
  db.buildSetTemplates = db.buildSetTemplates.filter((t) => t.name !== template.name).concat(saved)
  return saved
}

function setBranchActive(db: ApiDb, branchId: number, active: boolean): IBranch | undefined {
  for (const project of db.projects) {
    const branch = project.branches.find((b) => b.id === branchId)
    if (branch) {
      branch.active = active
      return branch
    }
  }
  return undefined
}

function setProjectActive(db: ApiDb, projectId: number, active: boolean): IProject | undefined {
  const project = db.projects.find((p) => p.id === projectId)
  if (project) {
    project.active = active
  }
  return project
}

function sameKey(a: string, b: string): boolean {
  return a.toLowerCase() === b.toLowerCase()
}

/** Like the API's conformance report: per key and value (ignoring case) for wrong values, per key for wrong entities. */
function violationsOf(db: ApiDb, definitions: ILabelDefinition[]): ILabelViolation[] {
  const counts = new Map<string, { violation: ILabelViolation, ids: Set<number> }>()
  const check = (target: 'BUILD' | 'DEPLOYMENT', id: number, labels: { key: string, value: string }[]) => {
    for (const label of labels) {
      const definition = definitions.find((d) => sameKey(d.key, label.key))
      const reason = definition ? violationOf(definition, target, label.value) : null
      if (!definition || !reason) continue
      const value = reason === 'WRONG_TARGET' ? null : label.value
      const id_ = `${definition.key}|${target}|${reason}|${value?.toLowerCase()}`
      const entry = counts.get(id_) ?? {violation: {key: definition.key, value, target, reason, count: 0}, ids: new Set<number>()}
      entry.ids.add(id)
      counts.set(id_, entry)
    }
  }
  db.builds.forEach((build) => check('BUILD', build.id, build.labels))
  db.deployments.forEach((deployment) => check('DEPLOYMENT', deployment.id, deployment.labels))
  return [...counts.values()]
    .map(({violation, ids}) => ({...violation, count: ids.size}))
    .sort((a, b) => compare(a.key.toLowerCase(), b.key.toLowerCase()) || compare(a.target, b.target) || compare(a.value ?? '', b.value ?? ''))
}

/** The API's consistency checks of a definition, or null when it is fine. */
function definitionProblem(definition: ILabelDefinition): string | null {
  if (definition.type === 'ENUM' && definition.allowedValues.length === 0) return 'type ENUM needs allowedValues'
  if (definition.type !== 'ENUM' && definition.allowedValues.length > 0) return 'allowedValues are only allowed for type ENUM'
  if (definition.type === 'REGEX' && !definition.pattern) return 'type REGEX needs a pattern'
  if (definition.type !== 'REGEX' && definition.pattern) return 'a pattern is only allowed for type REGEX'
  return null
}

export function installFakeApi(): void {
  cy.fixture('api-db.json').then((snapshot: ApiDb) => {
    const db: ApiDb = JSON.parse(JSON.stringify(snapshot))

    // Registered first, so it only answers what no stub below handles.
    cy.intercept({url: path('/.*')}, (req) => {
      req.reply({
        statusCode: 501,
        body: {key: 'not-stubbed', description: 'Not stubbed', message: `The fake API has no stub for ${req.method} ${req.url}`}
      })
    })

    cy.intercept({method: 'GET', url: path('/stats')}, (req) => req.reply(db.stats))
    cy.intercept({method: 'GET', url: path('/search-data')}, (req) => req.reply(db.searchData))

    // label definitions (build-bro-api#7)
    let labelSettings: ILabelSettings = {labelValidation: 'OFF'}
    cy.intercept({method: 'GET', url: path('/label-definitions')}, (req) => req.reply(db.labelDefinitions))
    cy.intercept({method: 'PUT', url: path('/label-definitions/[^/]+')}, (req) => {
      const key = lastSegment(req.url).trim()
      const sent: ILabelDefinition = req.body
      const definition: ILabelDefinition = {
        ...sent, key,
        appliesTo: sent.appliesTo?.length ? sent.appliesTo : ['BUILD', 'DEPLOYMENT'],
        type: sent.type ?? 'STRING', allowedValues: sent.allowedValues ?? [], valueStyles: sent.valueStyles ?? {}
      }
      const problem = definitionProblem(definition)
      if (problem) {
        req.reply({statusCode: 400, body: {key: 'invalid-request', description: 'Your request was not valid.', message: `Label definition '${key}': ${problem}`}})
        return
      }
      if (!/[?&]dryRun=true/.test(req.url)) {
        db.labelDefinitions = [...db.labelDefinitions.filter((d) => !sameKey(d.key, key)), definition]
          .sort((a, b) => compare(a.key, b.key))
      }
      const change: ILabelDefinitionChange = {definition, violations: violationsOf(db, [definition])}
      req.reply(change)
    })
    cy.intercept({method: 'DELETE', url: path('/label-definitions/[^/]+')}, (req) => {
      const key = lastSegment(req.url)
      db.labelDefinitions = db.labelDefinitions.filter((d) => !sameKey(d.key, key))
      req.reply({statusCode: 200})
    })
    cy.intercept({method: 'GET', url: path('/label-violations')}, (req) => req.reply(violationsOf(db, db.labelDefinitions)))
    cy.intercept({method: 'GET', url: path('/label-settings')}, (req) => req.reply(labelSettings))
    cy.intercept({method: 'PUT', url: path('/label-settings')}, (req) => {
      labelSettings = {labelValidation: req.body.labelValidation}
      req.reply(labelSettings)
    })

    // builds
    cy.intercept({method: 'POST', url: path('/builds/search')}, (req) => req.reply(searchBuilds(db, req.body)))

    // deployments
    cy.intercept({method: 'POST', url: path('/deployments/search')}, (req) => {
      const search: Partial<IDeploymentSearch> = req.body
      const matching = db.deployments.filter((deployment) => !search.serverName || deployment.serverName === search.serverName)
      req.reply(searchResult(matching, search, 'deployedAt'))
    })

    // servers
    cy.intercept({method: 'GET', url: path('/servers')}, (req) => req.reply(db.servers))
    cy.intercept({method: 'POST', url: path('/servers')}, (req) => {
      const server: IServer = req.body
      const index = db.servers.findIndex((s) => s.id === server.id)
      if (index < 0) {
        req.reply(notFound(`No Server found with id=${server.id}`))
        return
      }
      db.servers[index] = {...db.servers[index], ...server}
      req.reply(db.servers[index])
    })

    // projects and branches
    cy.intercept({method: 'GET', url: path('/projects')}, (req) => req.reply(db.projects))
    const projectOrBranch = (kind: string, active: boolean) =>
      cy.intercept({method: 'POST', url: path(`/projects/${kind}/\\d+`)}, (req) => {
        const id = Number(lastSegment(req.url))
        const updated = kind.startsWith('branch') ? setBranchActive(db, id, active) : setProjectActive(db, id, active)
        req.reply(updated ? updated : notFound(`No ${kind.startsWith('branch') ? 'Branch' : 'Project'} found with id=${id}`))
      })
    projectOrBranch('active', true)
    projectOrBranch('inactive', false)
    projectOrBranch('branch-active', true)
    projectOrBranch('branch-inactive', false)

    // build sets: the generic '/build-sets/{name}' stubs come first so the specific ones override them
    cy.intercept({method: 'GET', url: path('/build-sets/[^/]+')}, (req) => {
      const name = lastSegment(req.url)
      const template = findTemplate(db, name)
      req.reply(template ? template : notFound(`No Environment found with name='${name}'`))
    })
    cy.intercept({method: 'DELETE', url: path('/build-sets/[^/]+')}, (req) => {
      const name = lastSegment(req.url)
      if (!findTemplate(db, name)) {
        req.reply(notFound(`No Environment found with name='${name}'`))
        return
      }
      db.buildSetTemplates = db.buildSetTemplates.filter((template) => template.name !== name)
      req.reply({statusCode: 200})
    })
    cy.intercept({method: 'GET', url: path('/build-sets')}, (req) => req.reply(db.buildSetTemplates))
    cy.intercept({method: 'GET', url: path('/build-sets/names')}, (req) =>
      req.reply(db.buildSetTemplates.map((template) => template.name)))
    cy.intercept({method: 'GET', url: path('/build-sets/of/[^/]+')}, (req) => {
      const name = lastSegment(req.url)
      const template = findTemplate(db, name)
      req.reply(template ? resolveBuildTemplates(db, name, template.buildTemplates) : notFound(`No Environment found with name='${name}'`))
    })
    cy.intercept({method: 'POST', url: path('/build-sets/verify')}, (req) =>
      req.reply(resolveBuildTemplates(db, 'verification-result', req.body)))
    cy.intercept({method: 'POST', url: path('/build-sets')}, (req) => req.reply(saveTemplate(db, req.body)))
  })
}
