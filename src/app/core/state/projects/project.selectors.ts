import {createFeatureSelector, createSelector} from "@ngrx/store";
import * as Model from "../model";
import {IProject, ProjectsState} from "../model";
import {deepClone} from "../../util/deep-clone";

export const theProjectsState = createFeatureSelector<ProjectsState>('projects')

export const includeInactiveData = createSelector(
  theProjectsState, (state: ProjectsState): boolean => state.includeInactiveProjects
)
export const allActiveProjects = createSelector(
  theProjectsState, (state: Model.ProjectsState): IProject[] => {
    let toReturn: IProject[] = deepClone(state.projects.filter(p => p.active))
    toReturn.forEach(project => project.branches = project.branches.filter(b => b.active))
    return toReturn
  }
)
export const allProjects = createSelector(
  theProjectsState, (state: Model.ProjectsState): IProject[] => {
    return state.projects
  }
)

export const projectsData = createSelector(
  theProjectsState, allProjects, allActiveProjects, (state: ProjectsState, projects: IProject[], activeProjects: IProject[]): IProject[] => {
    return state.includeInactiveProjects ? projects : activeProjects
  }
)
