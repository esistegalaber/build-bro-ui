import {createAction, props} from '@ngrx/store'
import {IBuildSet, IBuildTemplate, IProject} from "../../core";

export const newBuildSet = createAction('[EditBuildSet] NEW')
export const changeProjectSelection = createAction('[EditBuildSet] CHANGE-PROJECTS-SELECTION', props<{ project: IProject, selected: boolean }>())
export const buildTemplateUpdated = createAction('[EditBuildSet] BUILD-TEMPLATE-UPDATED', props<{ buildTemplate: IBuildTemplate }>())
export const buildSetLoaded = createAction('[EditBuildSet] VERIFICATION-BUILD-SET-LOADED', props<{ buildSet: IBuildSet }>())
// export const updateCurrentEnvironment = createAction('UPDATE-ENVIRONMENT', props<{ environment: IEnvironment }>())
// export const saveEnvironment = createAction('SAVE-ENVIRONMENT', props<{ environment: IEnvironment }>())
// export const deleteEnvironment = createAction('DELETE-ENVIRONMENT')
// export const cloneCurrentEnvironment = createAction('CLONE-ENVIRONMENT')
// export const environmentToCloneLoaded = createAction('ENVIRONMENT-TO-CLONE-LOADED', props<{ environment: IEnvironment }>())
// export const addArtifactLabel = createAction('ADD-ARTIFACT-LABEL', props<{ label: IArtifactBuildLabel }>())
// export const removeArtifactLabel = createAction('REMOVE-ARTIFACT-LABEL', props<{ label: IArtifactBuildLabel }>())
// export const toggleArtifactOfEnvironment = createAction('TOGGLE-ARTIFACT-OF-ENVIRONMENT', props<{ projectName: string }>())
