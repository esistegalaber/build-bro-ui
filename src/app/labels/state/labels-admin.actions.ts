import {createAction, props} from "@ngrx/store";
import {ILabelDefinition, ILabelDefinitionChange, ILabelSettings, ILabelViolation} from "../../core";

export const loadLabelAdmin = createAction('[LABEL-ADMIN] LOAD')
export const labelViolationsLoaded = createAction('[LABEL-ADMIN] VIOLATIONS-LOADED', props<{ violations: ILabelViolation[] }>())
export const labelSettingsLoaded = createAction('[LABEL-ADMIN] SETTINGS-LOADED', props<{ settings: ILabelSettings }>())
export const saveLabelSettings = createAction('[LABEL-ADMIN] SAVE-SETTINGS', props<{ settings: ILabelSettings }>())
/** Checks a definition with the API without saving it (`dryRun`). */
export const previewLabelDefinition = createAction('[LABEL-ADMIN] PREVIEW-DEFINITION', props<{ key: string, definition: ILabelDefinition }>())
export const labelDefinitionPreviewed = createAction('[LABEL-ADMIN] DEFINITION-PREVIEWED', props<{ change: ILabelDefinitionChange }>())
export const saveLabelDefinition = createAction('[LABEL-ADMIN] SAVE-DEFINITION', props<{ key: string, definition: ILabelDefinition }>())
export const deleteLabelDefinition = createAction('[LABEL-ADMIN] DELETE-DEFINITION', props<{ key: string }>())
/** Forgets the last preview or save result, e.g. when another definition is opened. */
export const clearLabelReport = createAction('[LABEL-ADMIN] CLEAR-REPORT')
