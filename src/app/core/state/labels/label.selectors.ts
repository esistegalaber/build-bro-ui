import {createFeatureSelector, createSelector} from "@ngrx/store";
import {ILabelDefinition, LabelsState} from "../model";

export const labelsState = createFeatureSelector<LabelsState>('labels')
export const theLabelDefinitions = createSelector(
  labelsState, (state: LabelsState): ILabelDefinition[] => state.definitions
)
