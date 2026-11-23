import {INITIAL_LABEL_ADMIN_STATE, labelAdminReducer} from './labels-admin.reducer'
import {theLabelReport, theLabelSettings, theLabelViolations} from './labels-admin.selectors'
import * as LabelAdminActions from './labels-admin.actions'
import {labelDefinitionSaved} from '../../core/state/labels/label.actions'
import {ILabelDefinitionChange, ILabelViolation} from '../../core'
import {someLabelDefinitions} from '../../../testing/data'

const violation: ILabelViolation = {key: 'integration-test', value: 'broken', target: 'BUILD', reason: 'INVALID_VALUE', count: 45}
const change: ILabelDefinitionChange = {definition: someLabelDefinitions()[0], violations: [violation]}

describe('labelAdminReducer', () => {
  it('starts empty, without settings', () => {
    expect(labelAdminReducer(undefined, {type: '@@init'})).toEqual({violations: [], settings: null, report: null})
  })

  it('takes the violations and the settings', () => {
    let state = labelAdminReducer(INITIAL_LABEL_ADMIN_STATE, LabelAdminActions.labelViolationsLoaded({violations: [violation]}))
    state = labelAdminReducer(state, LabelAdminActions.labelSettingsLoaded({settings: {labelValidation: 'STRICT'}}))
    expect(state.violations).toEqual([violation])
    expect(state.settings).toEqual({labelValidation: 'STRICT'})
  })

  it('keeps the last preview or save as the report, until cleared', () => {
    const previewed = labelAdminReducer(INITIAL_LABEL_ADMIN_STATE, LabelAdminActions.labelDefinitionPreviewed({change}))
    expect(previewed.report).toEqual({change, saved: false})
    const saved = labelAdminReducer(previewed, labelDefinitionSaved({change}))
    expect(saved.report).toEqual({change, saved: true})
    expect(labelAdminReducer(saved, LabelAdminActions.clearLabelReport()).report).toBeNull()
  })
})

describe('label admin selectors', () => {
  it('select violations, settings and report', () => {
    const state = {violations: [violation], settings: {labelValidation: 'OFF' as const}, report: {change, saved: true}}
    expect(theLabelViolations.projector(state)).toBe(state.violations)
    expect(theLabelSettings.projector(state)).toBe(state.settings)
    expect(theLabelReport.projector(state)).toBe(state.report)
  })
})
