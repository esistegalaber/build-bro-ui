import {createAction, props} from "@ngrx/store";
import {IBranch, IProject} from "../model";

export const loadProjects = createAction('[PROJECTS] LOAD')
export const projectUpdated = createAction('[PROJECTS] PROJECT-UPDATED', props<{ project: IProject }>())
export const branchUpdated = createAction('[PROJECTS] BRANCH-UPDATED', props<{ branch: IBranch }>())
export const projectsLoaded = createAction('[PROJECTS] LOADED', props<{ projects: IProject[] }>())
export const toggleInactiveProjectsVisible = createAction('[PROJECTS] TOGGLE-INACTIVE-VISIBLE')
export const activateProject = createAction('[PROJECT] SINGLE-PROJECT-ACTIVE', props<{ projectId: number }>())
export const deactivateProject = createAction('[PROJECT] SINGLE-PROJECT-INACTIVE', props<{ projectId: number }>())
export const activateBranch = createAction('[PROJECT] SINGLE-BRANCH-ACTIVE', props<{ branchId: number }>())
export const deactivateBranch = createAction('[PROJECT] SINGLE-BRANCH-INACTIVE', props<{ branchId: number }>())
export const toggleInactiveData = createAction('[PROJECTS-PAGE]')
