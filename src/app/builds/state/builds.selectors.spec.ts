import {searchData, theBuildSearchPaginationParams, theBuilds, theBuildSearchParams, theBuildSearchResult} from './builds.selectors'
import {BuildsState, INITIAL_BUILD_SEARCH} from './builds.reducer'
import {build, someLabelDefinitions, someProjects} from '../../../testing/data'

describe('builds selectors', () => {
  const state: BuildsState = {
    search: {...INITIAL_BUILD_SEARCH.search, page: 2, pageSize: 25},
    result: {page: 2, totalElements: 90, totalPages: 4, hasNext: true, hasPrevious: true, data: [build(1, 'backend', 'main', 1)]},
    labelKeys: ['integration-test', 'revision']
  }

  it('select the search, the result and its builds', () => {
    expect(theBuildSearchParams.projector(state)).toBe(state.search)
    expect(theBuildSearchResult.projector(state)).toBe(state.result)
    expect(theBuilds.projector(state)).toBe(state.result.data)
  })

  it('combine the search and the result into the paginator parameters', () => {
    expect(theBuildSearchPaginationParams.projector(state, state)).toEqual({
      totalElements: 90, totalPages: 4, pageSize: 25, currentPage: 2, hasNext: true, hasPrevious: true
    })
  })

  it('offer the active projects and their active branches, the label keys and definitions as search choices', () => {
    expect(searchData.projector({includeInactiveProjects: false, projects: someProjects()}, state, someLabelDefinitions())).toEqual({
      projectNames: ['backend', 'frontend'],
      projectBranches: {backend: ['main', 'next'], frontend: ['main']},
      labelKeys: ['integration-test', 'revision'],
      labelDefinitions: someLabelDefinitions()
    })
  })
})
