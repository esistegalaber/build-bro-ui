import {createAction, props} from "@ngrx/store";
import {ILabelDefinition, ILabelDefinitionChange} from "../model";

export const loadLabelDefinitions = createAction('[LABELS] LOAD-DEFINITIONS')
export const labelDefinitionsLoaded = createAction('[LABELS] DEFINITIONS-LOADED', props<{ definitions: ILabelDefinition[] }>())
/** A definition was created or replaced (not a dry run): the API's answer, with the stored labels that don't fit. */
export const labelDefinitionSaved = createAction('[LABELS] DEFINITION-SAVED', props<{ change: ILabelDefinitionChange }>())
export const labelDefinitionDeleted = createAction('[LABELS] DEFINITION-DELETED', props<{ key: string }>())
