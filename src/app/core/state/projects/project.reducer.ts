import {createReducer, on} from "@ngrx/store";
import * as ProjectActions from "./project.actions";
import {IBranch, IProject, ProjectsState} from "../model";

const INITIAL_PROJECTS: ProjectsState = {
  includeInactiveProjects: false,
  projects: []
}

export const projectsReducer = createReducer(
  INITIAL_PROJECTS,
  on(ProjectActions.projectsLoaded, (state: ProjectsState, {projects}) => {
    return {...state, projects}
  }),
  on(ProjectActions.branchUpdated, (state: ProjectsState, {branch}) => {
    // only the changed project and branch are new objects; everything else is shared with the old state
    const projects = state.projects.map((project: IProject) => project.id !== branch.projectId ? project : {
      ...project,
      branches: project.branches.map((b: IBranch) => b.id === branch.id ? branch : b)
    })
    return {...state, projects}
  }),
  on(ProjectActions.projectUpdated, (state: ProjectsState, {project}) => {
    return state;
  }),
  on(ProjectActions.activateBranch, (state, {branchId}) => {
    return state;
  }),
  on(ProjectActions.toggleInactiveData, (state) => {
    return {...state, includeInactiveProjects: !state.includeInactiveProjects}
  })
)
