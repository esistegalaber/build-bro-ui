import {createAction, props} from '@ngrx/store'
import {EditableBuildTemplate, IBuildSet, IBuildSetTemplate, IProject} from "../../core";

export const newBuildSet = createAction('[EditBuildSet] NEW')
export const buildSetTemplateLoaded = createAction('[EditBuildSet] BUILd-SET-TEMPLATE-LOADED', props<{ theTemplate: IBuildSetTemplate }>())
export const projectAdded = createAction('[EditBuildSet] PROJECT-ADDED', props<{ project: IProject }>())
export const projectRemoved = createAction('[EditBuildSet] PROJECT-REMOVED', props<{ project: IProject }>())
export const buildTemplateUpdated = createAction('[EditBuildSet] BUILD-TEMPLATE-UPDATED', props<{ buildTemplate: EditableBuildTemplate }>())
export const buildSetLoaded = createAction('[EditBuildSet] VERIFICATION-BUILD-SET-LOADED', props<{ buildSet: IBuildSet }>())
export const saveWith = createAction('[EditBuildSet] SAVE-WITH-NAME', props<{ name: string }>())
export const navigateTo = createAction('[EditBuildSet] NAVIGATE-TO', props<{ navState: string }>())
