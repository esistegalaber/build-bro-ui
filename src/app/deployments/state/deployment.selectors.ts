import {createAction, createFeatureSelector, createSelector} from "@ngrx/store";
import {DeploymentsState, FEATURE_DEPLOYMENTS} from "./deployment.reducer";
import {IDeployment, IPaginationParams} from "../../core";

export const deploymentFeature = createFeatureSelector<DeploymentsState>(FEATURE_DEPLOYMENTS)
export const theDeploymentSearch = createSelector(
  deploymentFeature, (state) => state.search
)
export const theDeployments = createSelector(
  deploymentFeature, (state): IDeployment[] => state.result.data
)

export const theDeploymentSearchPaginationParams = createSelector(
  deploymentFeature, (state): IPaginationParams => {
    return {
      totalElements: state.result.totalElements,
      totalPages: state.result.totalPages,
      pageSize: state.search.pageSize,
      currentPage: state.search.page,
      hasNext: state.result.hasNext,
      hasPrevious: state.result.hasPrevious

    }
  }
)
