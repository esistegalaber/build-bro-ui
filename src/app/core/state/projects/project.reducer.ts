import {createReducer, on} from "@ngrx/store";
import * as ProjectActions from "./project.actions";
import {ProjectsState} from "../model";

const INITIAL_PROJECTS: ProjectsState = {
  includeInactiveProjects: false,
  projects: []
}

export const projectsReducer = createReducer(
  INITIAL_PROJECTS,
  on(ProjectActions.projectsLoaded, (state: ProjectsState, {projects}) => {
    return {...state, projects}
  })
)
