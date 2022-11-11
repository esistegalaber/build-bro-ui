import {createFeatureSelector, createSelector} from "@ngrx/store";
import * as Model from "../../core/";

export const buildsState = createFeatureSelector<Model.IBuildsState>('builds')
export const theBuildSearchParams = createSelector(
  buildsState, (state: Model.IBuildsState): Model.IBuildSearchParams => state.search
)
export const theBuildSearchResult = createSelector(
  buildsState, (state: Model.IBuildsState): Model.IBuildSearchResult => state.result
)
export const theBuilds = createSelector(
  buildsState, (state: Model.IBuildsState): Model.IBuild[] => state.result.data
)
export const availableSearchData = createSelector(
  buildsState, (state: Model.IBuildsState): Model.ISearchData => state.available
)
