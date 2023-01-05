import {createAction, props} from '@ngrx/store'
import {EditableBuildTemplate, IBuildSet, IBuildSetTemplate, IProject} from "../../core";

export const newBuildSet = createAction('[EditBuildSet] NEW')
export const loadBuildSetTemplate = createAction('[EditBuildSet] LOAD', props<{ name: string }>())
export const loadBuildSetTemplateToClone = createAction('[EditBuildSet] LOAD-TO-CLONE', props<{ name: string }>())
export const buildSetTemplateLoaded = createAction('[EditBuildSet] BUILd-SET-TEMPLATE-LOADED', props<{ theTemplate: IBuildSetTemplate }>())
export const buildSetTemplateToCloneLoaded = createAction('[EditBuildSet] LOADED-TO-CLONE', props<{ theTemplate: IBuildSetTemplate }>())
export const projectAdded = createAction('[EditBuildSet] PROJECT-ADDED', props<{ project: IProject }>())
export const projectRemoved = createAction('[EditBuildSet] PROJECT-REMOVED', props<{ project: IProject }>())
export const buildTemplateUpdated = createAction('[EditBuildSet] BUILD-TEMPLATE-UPDATED', props<{ buildTemplate: EditableBuildTemplate }>())
export const buildSetLoaded = createAction('[EditBuildSet] VERIFICATION-BUILD-SET-LOADED', props<{ buildSet: IBuildSet }>())
export const saveWith = createAction('[EditBuildSet] SAVE-WITH-NAME', props<{ name: string }>())
export const navigateTo = createAction('[EditBuildSet] NAVIGATE-TO', props<{ navState: string }>())
