import {createReducer, on} from "@ngrx/store";
import * as ProjectActions from "./project.actions";
import {IBranch, IProject, ProjectsState} from "../model";
import {deepClone} from "../../util/deep-clone";

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
    const newState: ProjectsState = deepClone(state)
    const theProject = newState.projects.find((project: IProject) => project.id === branch.projectId)
    if (!!theProject) {
      const currentBranch = theProject.branches.find((b: IBranch) => b.id === branch.id)
      if (!!currentBranch) {
        const indexOfBranch = theProject.branches.indexOf(currentBranch)
        if (indexOfBranch > -1) {
          theProject.branches[indexOfBranch] = branch
        }
      }
    }
    return newState;
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
