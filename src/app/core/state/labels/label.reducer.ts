import {createReducer, on} from "@ngrx/store";
import {LabelsState} from "../model";
import * as LabelActions from "./label.actions";

export const INITIAL_LABELS_STATE: LabelsState = {
  definitions: []
}

export const labelsReducer = createReducer(
  INITIAL_LABELS_STATE,
  on(LabelActions.labelDefinitionsLoaded, (state: LabelsState, {definitions}) => ({...state, definitions})),
  on(LabelActions.labelDefinitionSaved, (state: LabelsState, {change}) => {
    const others = state.definitions.filter((definition) => !sameKey(definition.key, change.definition.key))
    const definitions = [...others, change.definition].sort((a, b) => a.key.localeCompare(b.key))
    return {...state, definitions}
  }),
  on(LabelActions.labelDefinitionDeleted, (state: LabelsState, {key}) =>
    ({...state, definitions: state.definitions.filter((definition) => !sameKey(definition.key, key))}))
)

/** Keys are compared ignoring case, like the API does. */
function sameKey(a: string, b: string): boolean {
  return a.toLowerCase() === b.toLowerCase()
}
