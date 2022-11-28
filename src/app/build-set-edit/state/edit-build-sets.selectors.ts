import {createFeatureSelector, createSelector} from "@ngrx/store";
import {allActiveProjects, EditableBuildSetTemplate, EditableBuildTemplate, IBuild, IBuildSetTemplate, IBuildTemplate, IProject} from "../../core/";
import {EditBuildSetState, FEATURE_EDIT_BUILD_SET} from "./edit-build-sets.reducer";

export const myState = createFeatureSelector<EditBuildSetState>(FEATURE_EDIT_BUILD_SET)
export const theTemplate = createSelector(
  myState, (state: EditBuildSetState): IBuildSetTemplate => state.theTemplate
)
export const theBuildTemplates = createSelector(
  theTemplate, (template: IBuildSetTemplate): IBuildTemplate[] => template.buildTemplates
)
export const theEditableTemplate = createSelector(
  myState, allActiveProjects, (state: EditBuildSetState, allProjects: IProject[]): EditableBuildSetTemplate => {
    const theTemplate: EditableBuildSetTemplate = {
      name: state.theTemplate.name,
      projects: allProjects.filter(p => state.theTemplate.buildTemplates.map(bt => bt.project).indexOf(p.name) > -1)
    }
    return theTemplate
  }
)

export const theEditableBuildTemplates = createSelector(
  theTemplate, allActiveProjects, (buildSetTemplate: IBuildSetTemplate, projects: IProject[]): EditableBuildTemplate[] => {
    return buildSetTemplate.buildTemplates.map((bt: IBuildTemplate) => {
      let project = projects.find(p => p.name === bt.project) || <IProject>{
        id: -1,
        name: bt.project,
        branches: [],
        active: false
      }
      let branch = project.branches.find((b => b.name === bt.branch)) || null
      return {
        project: project,
        branch: branch,
        labels: {},
        buildNumber: null
      }
    })
  }
)
export const theBuilds = createSelector(
  myState, (state: EditBuildSetState): IBuild[] => Object.values(state.buildSet.builds)
)
export const theCurrentBuildTemplatesForVerification = createSelector(
  myState, (state: EditBuildSetState) => state.theTemplate.buildTemplates.map(bt => {
    return {
      project: bt.project,
      branch: bt.branch,
      buildNumber: bt.buildNumber
    }
  })
)

