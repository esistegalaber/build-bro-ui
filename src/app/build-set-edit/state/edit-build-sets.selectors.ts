import {createFeatureSelector, createSelector} from "@ngrx/store";
import {allActiveProjects, EditableBuildSetTemplate, EditableBuildTemplate, IBuild, IBuildSetTemplate, IBuildTemplate, IProject} from "../../core/";
import {EditBuildSetState, FEATURE_EDIT_BUILD_SET} from "./edit-build-sets.reducer";
import {mapToEditableBuildTemplate} from "./utils";

export const editBuildSetState = createFeatureSelector<EditBuildSetState>(FEATURE_EDIT_BUILD_SET)
export const theTemplate = createSelector(
  editBuildSetState, (state: EditBuildSetState): IBuildSetTemplate => state.theTemplate
)
export const theBuildTemplates = createSelector(
  theTemplate, (template: IBuildSetTemplate): IBuildTemplate[] => template.buildTemplates
)
export const theEditableTemplate = createSelector(
  editBuildSetState, allActiveProjects, (state: EditBuildSetState, allProjects: IProject[]): EditableBuildSetTemplate => {
    const theTemplate: EditableBuildSetTemplate = {
      name: state.theTemplate.name,
      projects: allProjects.filter(p => state.theTemplate.buildTemplates.map(bt => bt.project).indexOf(p.name) > -1)
    }
    return theTemplate
  }
)
export const theEditableBuildTemplates = createSelector(
  theTemplate, allActiveProjects, (buildSetTemplate: IBuildSetTemplate, projects: IProject[]): EditableBuildTemplate[] => {
    return projects.map((project) => mapToEditableBuildTemplate(project, buildSetTemplate))
  }
)
export const theBuilds = createSelector(
  editBuildSetState, (state: EditBuildSetState): IBuild[] => Object.values(state.buildSet.builds)
)
export const theCurrentBuildTemplatesForVerification = createSelector(
  editBuildSetState, (state: EditBuildSetState) => state.theTemplate.buildTemplates.map(bt => {
    return {
      project: bt.project,
      branch: bt.branch,
      buildNumber: bt.buildNumber
    }
  })
)

