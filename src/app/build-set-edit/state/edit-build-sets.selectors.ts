import {createFeatureSelector, createSelector} from "@ngrx/store";
import {IBuild, IBuildSetTemplate, IBuildTemplate} from "../../core/";
import {EditBuildSetState, FEATURE_EDIT_BUILD_SET} from "./edit-build-sets.model";

export const myState = createFeatureSelector<EditBuildSetState>(FEATURE_EDIT_BUILD_SET)
export const theTemplate = createSelector(
  myState, (state: EditBuildSetState): IBuildSetTemplate => state.theTemplate
)
export const theBuildTemplates = createSelector(
  myState, (state: EditBuildSetState): IBuildTemplate[] => state.theTemplate.buildTemplates
)
export const theBuilds = createSelector(
  myState, (state: EditBuildSetState): IBuild[] => Object.values(state.buildSet.builds)
)
export const theCurrentBuildTemplatesForVerification = createSelector(
  myState, (state: EditBuildSetState) => state.theTemplate.buildTemplates.map(bt => {
    return {
      project: bt.project.name,
      branch: bt.branch?.name,
      buildNumber: bt.buildNumber
    }
  })
)

