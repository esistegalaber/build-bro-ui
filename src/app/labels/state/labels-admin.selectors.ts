import {createFeatureSelector, createSelector} from "@ngrx/store";
import {FEATURE_LABEL_ADMIN, LabelAdminState} from "./labels-admin.reducer";

export const labelAdminState = createFeatureSelector<LabelAdminState>(FEATURE_LABEL_ADMIN)
export const theLabelViolations = createSelector(labelAdminState, (state) => state.violations)
export const theLabelSettings = createSelector(labelAdminState, (state) => state.settings)
export const theLabelReport = createSelector(labelAdminState, (state) => state.report)
