import {BuildsEffects} from './builds.effects'
import * as BuildActions from './builds.actions'
import {INITIAL_BUILD_SEARCH} from './builds.reducer'
import {theBuildSearchParams} from './builds.selectors'
import {backendErrorOccurred} from '../../core/state/alerts/alert.actions'
import {API_ERROR, collect, setUpEffects} from '../../../testing/effects'
import {IBuildSearchResult} from '../../core'

describe('BuildsEffects', () => {
  const search = {...INITIAL_BUILD_SEARCH.search, project: 'backend', page: 1}
  const result: IBuildSearchResult = {page: 1, totalElements: 0, totalPages: 0, hasNext: false, hasPrevious: true, data: []}
  const setUp = () => setUpEffects(BuildsEffects, {selectors: [{selector: theBuildSearchParams, value: search}]})

  it.each([
    ['doBuildSearch', BuildActions.doBuildSearch()],
    ['updateSearchParams', BuildActions.updateSearchParams({search})],
    ['toSearchPage', BuildActions.toSearchPage({page: 1})],
    ['resetSearchParams', BuildActions.resetSearchParams()]
  ])('searches with the current search parameters after %s', (_, trigger) => {
    const {effects, actions$, http} = setUp()
    const emitted = collect(effects.doBuildSearch$)
    actions$.next(trigger)
    const req = http.expectOne({method: 'POST', url: '/api/v1/builds/search'})
    expect(req.request.body).toEqual(search)
    req.flush(result)
    expect(emitted).toEqual([BuildActions.buildSearchLoaded({result})])
    http.verify()
  })

  it('reports a failed search', () => {
    const {effects, actions$, http} = setUp()
    const emitted = collect(effects.doBuildSearch$)
    actions$.next(BuildActions.doBuildSearch())
    http.expectOne('/api/v1/builds/search').flush(API_ERROR, {status: 500, statusText: 'Server Error'})
    expect(emitted.map((a) => a.type)).toEqual([backendErrorOccurred.type])
  })
})
