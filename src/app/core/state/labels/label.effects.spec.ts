import {LabelEffects} from './label.effects'
import * as LabelActions from './label.actions'
import {backendErrorOccurred} from '../alerts/alert.actions'
import {API_ERROR, collect, setUpEffects} from '../../../../testing/effects'
import {someLabelDefinitions} from '../../../../testing/data'

describe('LabelEffects', () => {
  it('loads the label definitions', () => {
    const {effects, actions$, http} = setUpEffects(LabelEffects)
    const emitted = collect(effects.loadDefinitions$)
    actions$.next(LabelActions.loadLabelDefinitions())
    http.expectOne({method: 'GET', url: '/api/v1/label-definitions'}).flush(someLabelDefinitions())
    expect(emitted).toEqual([LabelActions.labelDefinitionsLoaded({definitions: someLabelDefinitions()})])
    http.verify()
  })

  it('reports a failed load', () => {
    const {effects, actions$, http} = setUpEffects(LabelEffects)
    const emitted = collect(effects.loadDefinitions$)
    actions$.next(LabelActions.loadLabelDefinitions())
    http.expectOne('/api/v1/label-definitions').flush(API_ERROR, {status: 500, statusText: 'Server Error'})
    expect(emitted.map((a) => a.type)).toEqual([backendErrorOccurred.type])
  })
})
