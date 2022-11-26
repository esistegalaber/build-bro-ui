import {createFeatureSelector, createSelector} from "@ngrx/store";
import * as Model from "../../core/";
import {IBuild, IBuildSet, IBuildSetTemplate, IBuildTemplate, IProject, IProjectsResponse} from "../../core/";
import {theProjectsState} from "../../core/state/selectors";

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
export const allProjects = createSelector(
  theProjectsState, (state: Model.ProjectsState): IProject[] => state.projects
)
export const theCurrentBuildSetTemplate = createSelector(
  buildSetState,
  (state: Model.IBuildSetState): IBuildSetTemplate => state.currentTemplate
)
export const theCurrentBuildTemplates = createSelector(
  buildSetState,
  (state: Model.IBuildSetState): IBuildTemplate[] => state.currentTemplate.buildTemplates
)
