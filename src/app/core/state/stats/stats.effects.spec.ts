import {StatsEffects} from './stats.effects'
import {buildStatsLoaded, loadBuildStats} from './stats.state'
import {backendErrorOccurred} from '../alerts/alert.actions'
import {API_ERROR, collect, setUpEffects} from '../../../../testing/effects'

describe('StatsEffects', () => {
  it('loads the stats', () => {
    const {effects, actions$, http} = setUpEffects(StatsEffects)
    const emitted = collect(effects.loadBuildStats$)
    actions$.next(loadBuildStats())
    const stats = {numberOfProjects: 4, numberOfBranches: 14, numberOfBuilds: 90, numberOfLabels: 273, numberOfDeploys: 0}
    http.expectOne({method: 'GET', url: '/api/v1/stats'}).flush(stats)
    expect(emitted).toEqual([buildStatsLoaded({stats})])
    http.verify()
  })

  it('reports a failed request', () => {
    const {effects, actions$, http} = setUpEffects(StatsEffects)
    const emitted = collect(effects.loadBuildStats$)
    actions$.next(loadBuildStats())
    http.expectOne('/api/v1/stats').flush(API_ERROR, {status: 500, statusText: 'Server Error'})
    expect(emitted).toHaveLength(1)
    expect(emitted[0].type).toBe(backendErrorOccurred.type)
    expect((emitted[0] as ReturnType<typeof backendErrorOccurred>).errorResponse.status).toBe(500)
  })
})
