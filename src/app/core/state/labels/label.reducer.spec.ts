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

describe('labelsReducer after a save or delete', () => {
  const state = {definitions: someLabelDefinitions()}

  it('replaces a saved definition, matching the key ignoring case', () => {
    const definition = {...someLabelDefinitions()[1], key: 'Jenkins-Build', style: 'WARNING' as const}
    const next = labelsReducer(state, LabelActions.labelDefinitionSaved({change: {definition, violations: []}}))
    expect(next.definitions.map((d) => d.key)).toEqual(['integration-test', 'Jenkins-Build', 'revision'])
    expect(next.definitions[1].style).toBe('WARNING')
  })

  it('adds a new definition in key order', () => {
    const definition = {...someLabelDefinitions()[0], key: 'qa'}
    const next = labelsReducer(state, LabelActions.labelDefinitionSaved({change: {definition, violations: []}}))
    expect(next.definitions.map((d) => d.key)).toEqual(['integration-test', 'jenkins-build', 'qa', 'revision'])
  })

  it('removes a deleted definition, ignoring case', () => {
    const next = labelsReducer(state, LabelActions.labelDefinitionDeleted({key: 'REVISION'}))
    expect(next.definitions.map((d) => d.key)).toEqual(['integration-test', 'jenkins-build'])
  })
})

describe('label selectors', () => {
  it('select the definitions', () => {
    const definitions = someLabelDefinitions()
    expect(theLabelDefinitions.projector({definitions})).toBe(definitions)
  })
})
