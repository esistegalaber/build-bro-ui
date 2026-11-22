import {IDeploymentSearch, IDeploymentSearchResult} from "../../core";
import {createReducer, on} from "@ngrx/store";
import * as DeploymentActions from "./deployment.actions";

export const FEATURE_DEPLOYMENTS = 'deployments'

export interface DeploymentsState {
  search: IDeploymentSearch
  result: IDeploymentSearchResult
}

export const INITIAL_DEPLOYMENTS_STATE: DeploymentsState = {
  search: {
    serverName: '',
    pageSize: 10,
    page: 0,
    sortAttribute: 'deployedAt',
    sortDirection: 'desc'
  },
  result: {} as IDeploymentSearchResult
}

export const deploymentsReducer = createReducer(
  INITIAL_DEPLOYMENTS_STATE,
  on(DeploymentActions.deploymentsSearchLoaded, (state, {result}) => {
    return {...state, result}
  }),
  on(DeploymentActions.updateDeploymentsSearch, (state, {search}) => {
    // a different server or page size changes the pages, so start again on the first one
    const newSearch: IDeploymentSearch = {...search}
    if (search.serverName !== state.search.serverName || search.pageSize !== state.search.pageSize) {
      newSearch.page = 0
    }
    return {...state, search: newSearch}
  }),
  on(DeploymentActions.resetDeploymentsSearch, (state) => {
    return {...state, search: INITIAL_DEPLOYMENTS_STATE.search}
  }),
  on(DeploymentActions.toSearchPage, (state, {page}) => {
    return {...state, search: {...state.search, page}}
  })
)
