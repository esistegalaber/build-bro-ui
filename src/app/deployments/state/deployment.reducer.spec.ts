import {deploymentsReducer, DeploymentsState, INITIAL_DEPLOYMENTS_STATE} from './deployment.reducer'
import {theDeploymentSearch, theDeploymentSearchPaginationParams, theDeployments} from './deployment.selectors'
import * as DeploymentActions from './deployment.actions'
import {IDeploymentSearchResult} from '../../core'

describe('deploymentsReducer', () => {
  const onPage = (page: number): DeploymentsState =>
    ({...INITIAL_DEPLOYMENTS_STATE, search: {...INITIAL_DEPLOYMENTS_STATE.search, page}})

  it('starts with the newest deployments of all servers, 10 per page', () => {
    expect(deploymentsReducer(undefined, {type: '@@init'}).search).toEqual({
      serverName: '', pageSize: 10, page: 0, sortAttribute: 'deployedAt', sortDirection: 'desc'
    })
  })

  it('takes a loaded search result', () => {
    const result = {page: 0, totalElements: 0, totalPages: 0, hasNext: false, hasPrevious: false, data: []}
    expect(deploymentsReducer(INITIAL_DEPLOYMENTS_STATE, DeploymentActions.deploymentsSearchLoaded({result})).result).toBe(result)
  })

  it('goes back to the first page when the server or page size changes', () => {
    const state = onPage(1)
    for (const change of [{serverName: 'staging'}, {pageSize: 25}]) {
      const search = {...state.search, ...change}
      expect(deploymentsReducer(state, DeploymentActions.updateDeploymentsSearch({search})).search)
        .toEqual({...search, page: 0})
    }
  })

  it('keeps the page for other changes', () => {
    const state = onPage(1)
    const search = {...state.search, sortDirection: 'asc'}
    expect(deploymentsReducer(state, DeploymentActions.updateDeploymentsSearch({search})).search.page).toBe(1)
  })

  it('switches the page', () => {
    expect(deploymentsReducer(INITIAL_DEPLOYMENTS_STATE, DeploymentActions.toSearchPage({page: 1})).search.page).toBe(1)
  })

  it('resets the search to the starting values', () => {
    const state = {...onPage(1), search: {...onPage(1).search, serverName: 'staging', pageSize: 25}}
    expect(deploymentsReducer(state, DeploymentActions.resetDeploymentsSearch()).search)
      .toEqual(INITIAL_DEPLOYMENTS_STATE.search)
  })
})

describe('deployment selectors', () => {
  const result: IDeploymentSearchResult = {page: 1, totalElements: 11, totalPages: 2, hasNext: false, hasPrevious: true, data: []}
  const state: DeploymentsState = {search: {...INITIAL_DEPLOYMENTS_STATE.search, page: 1}, result}

  it('select the search and the deployments', () => {
    expect(theDeploymentSearch.projector(state)).toBe(state.search)
    expect(theDeployments.projector(state)).toBe(result.data)
  })

  it('combine the search and the result into the paginator parameters', () => {
    expect(theDeploymentSearchPaginationParams.projector(state)).toEqual({
      totalElements: 11, totalPages: 2, pageSize: 10, currentPage: 1, hasNext: false, hasPrevious: true
    })
  })
})
