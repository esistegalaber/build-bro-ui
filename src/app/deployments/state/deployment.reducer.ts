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
    return {...state, search}
  }),
  on(DeploymentActions.toSearchPage, (state, {page}) => {
    const newSearch: IDeploymentSearch = {...state.search, page}
    if(newSearch.serverName !== state.search.serverName || newSearch.pageSize !== state.search.pageSize){
      newSearch.page = 0;
    }
    return {
      ...state,
      search: newSearch
    }
  })
)
