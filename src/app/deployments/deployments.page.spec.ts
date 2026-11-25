import {TestBed} from '@angular/core/testing'
import {MockStore, provideMockStore} from '@ngrx/store/testing'
import {DeploymentsPage} from './deployments.page'
import * as DeploymentActions from './state/deployment.actions'
import {theDeploymentSearch, theDeploymentSearchPaginationParams, theDeployments} from './state/deployment.selectors'
import {INITIAL_DEPLOYMENTS_STATE} from './state/deployment.reducer'
import {allServers} from '../core/state/servers/server.selectors'
import {build, someServers} from '../../testing/data'
import {IDeployment, IPaginationParams} from '../core'
import {theLabelDefinitions} from '../core'

describe('DeploymentsPage', () => {
  const pagination = (totalElements: number): IPaginationParams => ({
    totalElements, totalPages: Math.ceil(totalElements / 10), pageSize: 10, currentPage: 0,
    hasPrevious: false, hasNext: totalElements > 10
  })
  const deployment: IDeployment = {
    id: 1, serverName: 'testserver', deployedAt: new Date().toISOString(), builds: [build(10, 'backend', 'main', 10)], labels: []
  }

  async function render(deployments: IDeployment[], total: number) {
    TestBed.configureTestingModule({
      imports: [DeploymentsPage],
      providers: [provideMockStore({
        selectors: [
          {selector: allServers, value: someServers()},
          {selector: theLabelDefinitions, value: []},
          {selector: theDeploymentSearch, value: INITIAL_DEPLOYMENTS_STATE.search},
          {selector: theDeployments, value: deployments},
          {selector: theDeploymentSearchPaginationParams, value: pagination(total)}
        ]
      })]
    })
    const dispatched = vi.spyOn(TestBed.inject(MockStore), 'dispatch')
    const fixture = TestBed.createComponent(DeploymentsPage)
    await fixture.whenStable()
    const byTestId = (id: string) => fixture.nativeElement.querySelector(`[data-testid="${id}"]`) as HTMLElement
    return {dispatched, byTestId}
  }

  it('searches when it opens', async () => {
    const {dispatched} = await render([], 0)
    expect(dispatched).toHaveBeenCalledWith(DeploymentActions.doDeploymentsSearch())
  })

  it('shows the number of deployments, the rows and the paginator', async () => {
    const {byTestId} = await render([deployment], 11)
    expect(byTestId('deployments-count').textContent?.trim()).toBe('11 deployments')
    expect(byTestId('deployment-1')).toBeTruthy()
    expect(byTestId('paginator-range').textContent?.trim()).toBe('Showing 1–10 of 11')
  })

  it('says "1 deployment" for a single result', async () => {
    const {byTestId} = await render([deployment], 1)
    expect(byTestId('deployments-count').textContent?.trim()).toBe('1 deployment')
  })

  it('shows an empty state that resets the filters', async () => {
    const {byTestId, dispatched} = await render([], 0)
    expect(byTestId('deployments-empty').textContent).toContain('No deployments match these filters.')
    ;(byTestId('deployments-empty').querySelector('button') as HTMLButtonElement).click()
    expect(dispatched).toHaveBeenCalledWith(DeploymentActions.resetDeploymentsSearch())
  })

  it('turns form and paginator events into actions', async () => {
    const {byTestId, dispatched} = await render([deployment], 11)
    byTestId('paginator-next').click()
    expect(dispatched).toHaveBeenCalledWith(DeploymentActions.toSearchPage({page: 1}))
    byTestId('search-reset').click()
    expect(dispatched).toHaveBeenCalledWith(DeploymentActions.resetDeploymentsSearch())
    byTestId('search-reload').click()
    expect(dispatched).toHaveBeenCalledWith(DeploymentActions.updateDeploymentsSearch({search: INITIAL_DEPLOYMENTS_STATE.search}))
  })
})
