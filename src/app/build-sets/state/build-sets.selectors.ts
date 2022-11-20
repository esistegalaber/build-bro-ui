import {createFeatureSelector, createSelector} from "@ngrx/store";
import * as Model from "../../core/";
import {IBuild, IBuildSet} from "../../core/";

export const buildSetState = createFeatureSelector<Model.IBuildSetState>('buildSets')
export const theBuildSetTemplateNames = createSelector(
  buildSetState,
  (state: Model.IBuildSetState): string[] => state.names
)
export const theCurrentBuildSetName = createSelector(
  buildSetState,
  (state: Model.IBuildSetState): string => state.buildSet.name
)
export const theBuildsOfBuildSet = createSelector(
  buildSetState,
  (state: Model.IBuildSetState): IBuild[] => Object.values(state.buildSet.builds)
)
