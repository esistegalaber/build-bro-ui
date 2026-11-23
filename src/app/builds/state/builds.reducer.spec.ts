import {buildReducer, BuildsState, INITIAL_BUILD_SEARCH} from './builds.reducer'
import * as BuildActions from './builds.actions'
import {build} from '../../../testing/data'
import {IBuildSearchResult} from '../../core'
import {deepFreeze} from '../../../testing/freeze'

describe('buildReducer', () => {
  // frozen, as NgRx keeps its state in dev mode: a reducer that changes it fails the test
  const onPage = (page: number): BuildsState => deepFreeze(structuredClone({...INITIAL_BUILD_SEARCH, search: {...INITIAL_BUILD_SEARCH.search, page}}))

  it('starts with the newest builds of all projects, 10 per page', () => {
    expect(buildReducer(undefined, {type: '@@init'}).search).toEqual({
      project: '', branch: '', page: 0, pageSize: 10, labels: {},
      sortAttribute: 'buildNumber', sortDirection: 'DESC', minBuildNumber: null, maxBuildNumber: null
    })
  })

  it('takes a loaded search result', () => {
    const result: IBuildSearchResult = {
      page: 0, totalElements: 1, totalPages: 1, hasNext: false, hasPrevious: false, data: [build(10, 'backend', 'main', 10)]
    }
    expect(buildReducer(INITIAL_BUILD_SEARCH, BuildActions.buildSearchLoaded({result})).result).toBe(result)
  })

  describe('updateSearchParams', () => {
    it('goes back to the first page when the project, branch or page size changes', () => {
      const state = onPage(3)
      for (const change of [{project: 'backend'}, {branch: 'main'}, {pageSize: 25}]) {
        const search = {...state.search, ...change}
        expect(buildReducer(state, BuildActions.updateSearchParams({search})).search.page).toBe(0)
      }
    })

    it('keeps the page for other changes', () => {
      const state = onPage(3)
      const search = {...state.search, minBuildNumber: 5}
      expect(buildReducer(state, BuildActions.updateSearchParams({search})).search).toEqual(search)
    })
  })

  it('switches the page', () => {
    expect(buildReducer(INITIAL_BUILD_SEARCH, BuildActions.toSearchPage({page: 4})).search.page).toBe(4)
  })

  it('adds and removes a label filter without changing the old state', () => {
    const label = {id: 0, key: 'integration-test', value: 'ok'}
    const withLabel = buildReducer(INITIAL_BUILD_SEARCH, BuildActions.addSearchLabel({label}))
    expect(withLabel.search.labels).toEqual({'integration-test': 'ok'})
    expect(INITIAL_BUILD_SEARCH.search.labels).toEqual({})
    const without = buildReducer(withLabel, BuildActions.removeSearchLabel({label}))
    expect(without.search.labels).toEqual({})
    expect(withLabel.search.labels).toEqual({'integration-test': 'ok'})
  })

  it('resets the search to the starting values', () => {
    const state = {...onPage(2), search: {...onPage(2).search, project: 'backend', pageSize: 50, minBuildNumber: 5}}
    expect(buildReducer(state, BuildActions.resetSearchParams()).search).toEqual(INITIAL_BUILD_SEARCH.search)
  })

  it('keeps the label keys of the search data', () => {
    const available = {projectNames: [], projectBranches: {}, labelKeys: ['integration-test'], labelDefinitions: []}
    expect(buildReducer(INITIAL_BUILD_SEARCH, BuildActions.availableBuildSearchDataLoaded({available})).labelKeys)
      .toEqual(['integration-test'])
  })
})
