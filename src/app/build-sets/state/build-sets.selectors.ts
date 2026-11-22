import {createFeatureSelector, createSelector} from "@ngrx/store";
import {IBuildSet} from "../../core/";
import {BuildSetsState, BuildSetSummary, FEATURE_BUILD_SETS} from "./build-sets.model";

export const buildSetState = createFeatureSelector<BuildSetsState>(FEATURE_BUILD_SETS)
export const theBuildSetSummaries = createSelector(
  buildSetState,
  (state: BuildSetsState): BuildSetSummary[] => state.templates.map((template) => ({
    name: template.name,
    projects: template.buildTemplates.length,
    pinned: template.buildTemplates.filter((bt) => bt.buildNumber !== null && bt.buildNumber !== undefined).length
  }))
)
export const theBuildSet = createSelector(
  buildSetState,
  (state: BuildSetsState): IBuildSet => state.buildSet
)
export const theSelectedBuildSetName = createSelector(
  buildSetState,
  (state: BuildSetsState): string | null => state.selected
)
export const theSelectedSummary = createSelector(
  theBuildSetSummaries, theSelectedBuildSetName,
  (summaries: BuildSetSummary[], selected: string | null): BuildSetSummary | null =>
    summaries.find((summary) => summary.name === selected) ?? null
)
