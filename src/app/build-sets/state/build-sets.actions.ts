import {createAction, props} from '@ngrx/store'
import {IBuildSet, IBuildSetTemplate} from "../../core";

export const loadBuildSetNames = createAction('[BuildSet] LOAD-TEMPLATE-NAMES')
export const buildSetNamesLoaded = createAction('[BuildSet] TEMPLATE-NAMES-LOADED', props<{ names: string[] }>())
export const loadBuildSetOf = createAction('[BuildSet] LOAD-BUILD-SET', props<{ templateName: string }>())
export const buildSetLoaded = createAction('[BuildSet] BUILD-SET-LOADED', props<{ buildSet: IBuildSet }>())
export const newEnvironment = createAction('NEW-ENVIRONMENT')
export const loadSingleBuildSetTemplate = createAction('LOAD-SINGLE-ENVIRONMENT', props<{ environmentName: string }>())
export const singleBuildSetTemplateLoaded = createAction('SINGLE-ENVIRONMENT-LOADED', props<{ environment: IBuildSetTemplate }>())
export const environmentSelected = createAction('ENVIRONMENT-SELECTED', props<{ environmentName: string }>())
// export const updateCurrentEnvironment = createAction('UPDATE-ENVIRONMENT', props<{ environment: IEnvironment }>())
// export const saveEnvironment = createAction('SAVE-ENVIRONMENT', props<{ environment: IEnvironment }>())
// export const deleteEnvironment = createAction('DELETE-ENVIRONMENT')
// export const cloneCurrentEnvironment = createAction('CLONE-ENVIRONMENT')
// export const environmentToCloneLoaded = createAction('ENVIRONMENT-TO-CLONE-LOADED', props<{ environment: IEnvironment }>())
// export const addArtifactLabel = createAction('ADD-ARTIFACT-LABEL', props<{ label: IArtifactBuildLabel }>())
// export const removeArtifactLabel = createAction('REMOVE-ARTIFACT-LABEL', props<{ label: IArtifactBuildLabel }>())
// export const toggleArtifactOfEnvironment = createAction('TOGGLE-ARTIFACT-OF-ENVIRONMENT', props<{ projectName: string }>())
