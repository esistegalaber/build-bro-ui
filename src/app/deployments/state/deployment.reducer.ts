import {IDeploymentSearch, IDeploymentSearchResult} from "../../core";
import {createReducer, on} from "@ngrx/store";
import * as DeploymentActions from "./deployment.actions";
import {toSearchPage} from "../../builds/state/builds.actions";
import {BuildsState} from "../../builds/state/builds.reducer";

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
  on(toSearchPage, (state, {page}) => {
    const newSearch = {...state.search, page: page}
    return {
      ...state,
      search: newSearch
    }
  })
)
