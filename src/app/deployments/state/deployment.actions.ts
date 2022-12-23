import {createAction, props} from "@ngrx/store";
import {IDeploymentSearch, IDeploymentSearchResult} from "../../core";

export const doDeploymentsSearch = createAction('[DEPLOYMENTS] DO-DEPLOYMENTS-SEARCH')
export const updateDeploymentsSearch = createAction('[DEPLOYMENTS] UPDATE-DEPLOYMENTS-SEARCH', props<{ search: IDeploymentSearch }>())
export const deploymentsSearchLoaded = createAction('[DEPLOYMENTS] DEPLOYMENTS-SEARCH-LOADED', props<{ result: IDeploymentSearchResult }>())
export const toSearchPage = createAction('[DEPLOYMENTS] TO-SEARCH-PAGE', props<{ page: number }>())
