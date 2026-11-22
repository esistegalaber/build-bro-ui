import {createAction, props} from '@ngrx/store'
import {IBuildSet, IBuildSetTemplate} from "../../core";

export const loadBuildSetTemplates = createAction('[build-sets] LOAD-TEMPLATES')
export const buildSetTemplatesLoaded = createAction('[build-sets] TEMPLATES-LOADED', props<{ templates: IBuildSetTemplate[] }>())
export const loadBuildSetOf = createAction('[build-sets] LOAD-BUILD-SET', props<{ templateName: string }>())
export const buildSetLoaded = createAction('[build-sets] BUILD-SET-LOADED', props<{ buildSet: IBuildSet }>())
export const deleteBuildSetTemplate = createAction('[build-sets] DELETE-BUILD-SET', props<{ name: string }>())
export const buildSetTemplateDeleted = createAction('[build-sets] BUILD-SET-DELETED', props<{ name: string }>())
