import {INITIAL_LABELS_STATE, labelsReducer} from './label.reducer'
import {theLabelDefinitions} from './label.selectors'
import * as LabelActions from './label.actions'
import {someLabelDefinitions} from '../../../../testing/data'

describe('labelsReducer', () => {
  it('starts without definitions', () => {
    expect(labelsReducer(undefined, {type: '@@init'})).toEqual({definitions: []})
  })

  it('takes the loaded definitions', () => {
    const definitions = someLabelDefinitions()
    expect(labelsReducer(INITIAL_LABELS_STATE, LabelActions.labelDefinitionsLoaded({definitions})).definitions).toBe(definitions)
  })
})

describe('label selectors', () => {
  it('select the definitions', () => {
    const definitions = someLabelDefinitions()
    expect(theLabelDefinitions.projector({definitions})).toBe(definitions)
  })
})
