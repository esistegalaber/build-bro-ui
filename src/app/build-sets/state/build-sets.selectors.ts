import {createFeatureSelector, createSelector} from "@ngrx/store";
import {IBuildSet} from "../../core/";
import {BuildSetsState, FEATURE_BUILD_SETS} from "./build-sets.model";

export const buildSetState = createFeatureSelector<BuildSetsState>(FEATURE_BUILD_SETS)
export const theBuildSetTemplateNames = createSelector(
  buildSetState,
  (state: BuildSetsState): string[] => state.names
)
export const theBuildSet = createSelector(
  buildSetState,
  (state: BuildSetsState): IBuildSet => state.buildSet
)
