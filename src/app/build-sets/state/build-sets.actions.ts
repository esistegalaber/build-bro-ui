import {createAction, props} from '@ngrx/store'
import {IBuildSet} from "../../core";

export const loadBuildSetNames = createAction('[build-sets] LOAD-TEMPLATE-NAMES')
export const buildSetNamesLoaded = createAction('[build-sets] TEMPLATE-NAMES-LOADED', props<{ names: string[] }>())
export const loadBuildSetOf = createAction('[build-sets] LOAD-BUILD-SET', props<{ templateName: string }>())
export const buildSetLoaded = createAction('[build-sets] BUILD-SET-LOADED', props<{ buildSet: IBuildSet }>())
