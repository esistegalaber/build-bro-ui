import {TestBed} from '@angular/core/testing'
import {provideRouter} from '@angular/router'
import {MockStore, provideMockStore} from '@ngrx/store/testing'
import {HomePage} from './home.page'
import {loadHome} from './state/home.actions'
import {theHomeBuildSets, theRecentDeployments} from './state/home.selectors'
import {loadBuildStats} from '../core/state/stats/stats.state'
import {allServers} from '../core/state/servers/server.selectors'
import {someServers} from '../../testing/data'

describe('HomePage', () => {
  async function render() {
    TestBed.configureTestingModule({
      imports: [HomePage],
      providers: [
        provideRouter([]),
        provideMockStore({
          initialState: {stats: {numberOfProjects: 4, numberOfBranches: 14, numberOfBuilds: 90, numberOfLabels: 273, numberOfDeploys: 0}},
          selectors: [
            {selector: allServers, value: someServers()},
            {selector: theRecentDeployments, value: []},
            {selector: theHomeBuildSets, value: [{name: 'main', projects: 2, pinned: 1}]}
          ]
        })
      ]
    })
    const dispatched = vi.spyOn(TestBed.inject(MockStore), 'dispatch')
    const fixture = TestBed.createComponent(HomePage)
    await fixture.whenStable()
    const byTestId = (id: string) => fixture.nativeElement.querySelector(`[data-testid="${id}"]`) as HTMLElement
    return {dispatched, byTestId}
  }

  it('loads fresh stats, the recent deployments and the build sets when it opens', async () => {
    const {dispatched} = await render()
    expect(dispatched).toHaveBeenCalledWith(loadBuildStats())
    expect(dispatched).toHaveBeenCalledWith(loadHome())
  })

  it('shows the stats, the deployments, the build sets and a way to the builds', async () => {
    const {byTestId} = await render()
    expect(byTestId('stat-builds').textContent).toContain('90')
    expect(byTestId('home-deployments-none')).toBeTruthy()
    expect(byTestId('home-build-set-main')).toBeTruthy()
    expect(byTestId('browse-builds').getAttribute('href')).toBe('/builds')
  })
})
