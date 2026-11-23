import {createAction, props} from "@ngrx/store";
import {ILabelDefinition} from "../model";

export const loadLabelDefinitions = createAction('[LABELS] LOAD-DEFINITIONS')
export const labelDefinitionsLoaded = createAction('[LABELS] DEFINITIONS-LOADED', props<{ definitions: ILabelDefinition[] }>())
