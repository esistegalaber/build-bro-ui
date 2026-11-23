import {createReducer, on} from "@ngrx/store";
import {ILabelDefinitionChange, ILabelSettings, ILabelViolation} from "../../core";
import {labelDefinitionSaved} from "../../core/state/labels/label.actions";
import {clearLabelReport, labelDefinitionPreviewed, labelSettingsLoaded, labelViolationsLoaded} from "./labels-admin.actions";

export const FEATURE_LABEL_ADMIN = 'labelAdmin'

/** What the API said about a definition: after a preview (`saved: false`) or a save. */
export interface LabelReport {
  change: ILabelDefinitionChange
  saved: boolean
}

export interface LabelAdminState {
  /** The conformance report: stored labels that don't fit their definition */
  violations: ILabelViolation[]
  /** null until loaded */
  settings: ILabelSettings | null
  report: LabelReport | null
}

export const INITIAL_LABEL_ADMIN_STATE: LabelAdminState = {
  violations: [],
  settings: null,
  report: null
}

export const labelAdminReducer = createReducer(
  INITIAL_LABEL_ADMIN_STATE,
  on(labelViolationsLoaded, (state: LabelAdminState, {violations}) => ({...state, violations})),
  on(labelSettingsLoaded, (state: LabelAdminState, {settings}) => ({...state, settings})),
  on(labelDefinitionPreviewed, (state: LabelAdminState, {change}) => ({...state, report: {change, saved: false}})),
  on(labelDefinitionSaved, (state: LabelAdminState, {change}) => ({...state, report: {change, saved: true}})),
  on(clearLabelReport, (state: LabelAdminState) => ({...state, report: null}))
)
