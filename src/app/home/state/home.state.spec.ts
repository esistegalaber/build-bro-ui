import {homeReducer, INITIAL_HOME_STATE} from './home.reducer'
import {theHomeBuildSets, theRecentDeployments} from './home.selectors'
import * as HomeActions from './home.actions'
import {HomeEffects, RECENT_DEPLOYMENTS_SEARCH} from './home.effects'
import {backendErrorOccurred} from '../../core/state/alerts/alert.actions'
import {API_ERROR, collect, setUpEffects} from '../../../testing/effects'
import {build} from '../../../testing/data'
import {IDeployment} from '../../core'

const deployment = (id: number): IDeployment => ({
  id, deployedAt: '2026-11-19T08:42:34', serverName: 'testserver', builds: [build(10, 'backend', 'main', 10)], labels: []
})

describe('homeReducer', () => {
  it('starts with nothing loaded', () => {
    expect(homeReducer(undefined, {type: '@@init'})).toEqual({recentDeployments: null, buildSets: null})
  })

  it('takes the recent deployments and the build sets', () => {
    const deployments = [deployment(1)]
    const templates = [{id: 1, name: 'main', buildTemplates: []}]
    let state = homeReducer(INITIAL_HOME_STATE, HomeActions.recentDeploymentsLoaded({deployments}))
    state = homeReducer(state, HomeActions.homeBuildSetsLoaded({templates}))
    expect(state).toEqual({recentDeployments: deployments, buildSets: templates})
  })
})

describe('home selectors', () => {
  it('select the recent deployments, null while loading', () => {
    expect(theRecentDeployments.projector(INITIAL_HOME_STATE)).toBeNull()
    expect(theRecentDeployments.projector({recentDeployments: [], buildSets: null})).toEqual([])
  })

  it('summarize the build sets, null while loading', () => {
    expect(theHomeBuildSets.projector(INITIAL_HOME_STATE)).toBeNull()
    expect(theHomeBuildSets.projector({
      recentDeployments: null,
      buildSets: [{
        name: 'main', buildTemplates: [
          {project: 'backend', branch: 'main', buildNumber: 9, labels: {}},
          {project: 'frontend', branch: 'main', buildNumber: null, labels: {}}
        ]
      }]
    })).toEqual([{name: 'main', projects: 2, pinned: 1}])
  })
})

describe('HomeEffects', () => {
  it('loads the three newest deployments of all servers', () => {
    const {effects, actions$, http} = setUpEffects(HomeEffects)
    const emitted = collect(effects.recentDeployments$)
    actions$.next(HomeActions.loadHome())
    const req = http.expectOne({method: 'POST', url: '/api/v1/deployments/search'})
    expect(req.request.body).toEqual(RECENT_DEPLOYMENTS_SEARCH)
    expect(RECENT_DEPLOYMENTS_SEARCH).toMatchObject({serverName: '', page: 0, pageSize: 3, sortAttribute: 'deployedAt', sortDirection: 'DESC'})
    req.flush({page: 0, totalElements: 11, totalPages: 4, hasNext: true, hasPrevious: false, data: [deployment(1)]})
    expect(emitted).toEqual([HomeActions.recentDeploymentsLoaded({deployments: [deployment(1)]})])
  })

  it('loads the build sets', () => {
    const {effects, actions$, http} = setUpEffects(HomeEffects)
    const emitted = collect(effects.buildSets$)
    actions$.next(HomeActions.loadHome())
    const templates = [{id: 1, name: 'main', buildTemplates: []}]
    http.expectOne({method: 'GET', url: '/api/v1/build-sets'}).flush(templates)
    expect(emitted).toEqual([HomeActions.homeBuildSetsLoaded({templates})])
  })

  it.each([
    ['recentDeployments$', '/api/v1/deployments/search'],
    ['buildSets$', '/api/v1/build-sets']
  ] as const)('reports a failure of %s', (effect, url) => {
    const {effects, actions$, http} = setUpEffects(HomeEffects)
    const emitted = collect(effects[effect])
    actions$.next(HomeActions.loadHome())
    http.expectOne(url).flush(API_ERROR, {status: 500, statusText: 'Server Error'})
    expect(emitted.map((a) => a.type)).toEqual([backendErrorOccurred.type])
  })
})
