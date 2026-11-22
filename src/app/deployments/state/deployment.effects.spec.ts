import {DeploymentEffects} from './deployment.effects'
import * as DeploymentActions from './deployment.actions'
import {INITIAL_DEPLOYMENTS_STATE} from './deployment.reducer'
import {theDeploymentSearch} from './deployment.selectors'
import {backendErrorOccurred} from '../../core/state/alerts/alert.actions'
import {API_ERROR, collect, setUpEffects} from '../../../testing/effects'
import {IDeploymentSearchResult} from '../../core'

describe('DeploymentEffects', () => {
  const search = {...INITIAL_DEPLOYMENTS_STATE.search, serverName: 'staging'}
  const result: IDeploymentSearchResult = {page: 0, totalElements: 0, totalPages: 0, hasNext: false, hasPrevious: false, data: []}
  const setUp = () => setUpEffects(DeploymentEffects, {selectors: [{selector: theDeploymentSearch, value: search}]})

  it.each([
    ['doDeploymentsSearch', DeploymentActions.doDeploymentsSearch()],
    ['updateDeploymentsSearch', DeploymentActions.updateDeploymentsSearch({search})],
    ['toSearchPage', DeploymentActions.toSearchPage({page: 1})],
    ['resetDeploymentsSearch', DeploymentActions.resetDeploymentsSearch()]
  ])('searches with the current search after %s', (_, trigger) => {
    const {effects, actions$, http} = setUp()
    const emitted = collect(effects.deploymentSearch$)
    actions$.next(trigger)
    const req = http.expectOne({method: 'POST', url: '/api/v1/deployments/search'})
    expect(req.request.body).toEqual(search)
    req.flush(result)
    expect(emitted).toEqual([DeploymentActions.deploymentsSearchLoaded({result})])
    http.verify()
  })

  it('reports a failed search', () => {
    const {effects, actions$, http} = setUp()
    const emitted = collect(effects.deploymentSearch$)
    actions$.next(DeploymentActions.doDeploymentsSearch())
    http.expectOne('/api/v1/deployments/search').flush(API_ERROR, {status: 500, statusText: 'Server Error'})
    expect(emitted.map((a) => a.type)).toEqual([backendErrorOccurred.type])
  })
})
