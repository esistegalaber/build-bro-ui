import {createAction, props} from "@ngrx/store";
import {IProject} from "../model";

export const loadProjects = createAction('[PROJECTS] LOAD')
export const projectsLoaded = createAction('[PROJECTS] LOADED', props<{ projects: IProject[] }>())
export const toggleInactiveProjectsVisible = createAction('[PROJECTS] TOGGLE-INACTIVE-VISIBLE')
