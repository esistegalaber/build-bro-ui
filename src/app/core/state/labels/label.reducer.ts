import {createReducer, on} from "@ngrx/store";
import {LabelsState} from "../model";
import * as LabelActions from "./label.actions";

export const INITIAL_LABELS_STATE: LabelsState = {
  definitions: []
}

export const labelsReducer = createReducer(
  INITIAL_LABELS_STATE,
  on(LabelActions.labelDefinitionsLoaded, (state: LabelsState, {definitions}) => ({...state, definitions}))
)
