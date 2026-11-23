import {LabelAdminEffects} from './labels-admin.effects'
import * as LabelAdminActions from './labels-admin.actions'
import {labelDefinitionDeleted, labelDefinitionSaved} from '../../core/state/labels/label.actions'
import {backendErrorOccurred} from '../../core/state/alerts/alert.actions'
import {ILabelDefinitionChange} from '../../core'
import {API_ERROR, collect, setUpEffects} from '../../../testing/effects'
import {someLabelDefinitions} from '../../../testing/data'

const definition = someLabelDefinitions()[0]
const change: ILabelDefinitionChange = {definition, violations: []}

describe('LabelAdminEffects', () => {
  it.each([
    ['the page opens', LabelAdminActions.loadLabelAdmin()],
    ['a definition was saved', labelDefinitionSaved({change})],
    ['a definition was deleted', labelDefinitionDeleted({key: 'qa'})]
  ])('loads the violations when %s', (_, action) => {
    const {effects, actions$, http} = setUpEffects(LabelAdminEffects)
    const emitted = collect(effects.loadViolations$)
    actions$.next(action)
    http.expectOne({method: 'GET', url: '/api/v1/label-violations'}).flush([])
    expect(emitted).toEqual([LabelAdminActions.labelViolationsLoaded({violations: []})])
  })

  it('loads and saves the settings', () => {
    const {effects, actions$, http} = setUpEffects(LabelAdminEffects)
    const loaded = collect(effects.loadSettings$)
    const saved = collect(effects.saveSettings$)
    actions$.next(LabelAdminActions.loadLabelAdmin())
    http.expectOne({method: 'GET', url: '/api/v1/label-settings'}).flush({labelValidation: 'OFF'})
    actions$.next(LabelAdminActions.saveLabelSettings({settings: {labelValidation: 'STRICT'}}))
    const put = http.expectOne({method: 'PUT', url: '/api/v1/label-settings'})
    expect(put.request.body).toEqual({labelValidation: 'STRICT'})
    put.flush({labelValidation: 'STRICT'})
    expect(loaded).toEqual([LabelAdminActions.labelSettingsLoaded({settings: {labelValidation: 'OFF'}})])
    expect(saved).toEqual([LabelAdminActions.labelSettingsLoaded({settings: {labelValidation: 'STRICT'}})])
  })

  it('previews a definition as a dry run', () => {
    const {effects, actions$, http} = setUpEffects(LabelAdminEffects)
    const emitted = collect(effects.preview$)
    actions$.next(LabelAdminActions.previewLabelDefinition({key: 'integration-test', definition}))
    const put = http.expectOne((req) => req.method === 'PUT' && req.url === '/api/v1/label-definitions/integration-test')
    expect(put.request.params.get('dryRun')).toBe('true')
    expect(put.request.body).toEqual(definition)
    put.flush(change)
    expect(emitted).toEqual([LabelAdminActions.labelDefinitionPreviewed({change})])
  })

  it('saves a definition, encoding the key', () => {
    const {effects, actions$, http} = setUpEffects(LabelAdminEffects)
    const emitted = collect(effects.save$)
    actions$.next(LabelAdminActions.saveLabelDefinition({key: 'docker/image', definition}))
    const put = http.expectOne({method: 'PUT', url: '/api/v1/label-definitions/docker%2Fimage'})
    expect(put.request.params.has('dryRun')).toBe(false)
    put.flush(change)
    expect(emitted).toEqual([labelDefinitionSaved({change})])
  })

  it('deletes a definition', () => {
    const {effects, actions$, http} = setUpEffects(LabelAdminEffects)
    const emitted = collect(effects.delete$)
    actions$.next(LabelAdminActions.deleteLabelDefinition({key: 'revision'}))
    http.expectOne({method: 'DELETE', url: '/api/v1/label-definitions/revision'}).flush(null)
    expect(emitted).toEqual([labelDefinitionDeleted({key: 'revision'})])
  })

  it.each([
    ['loadViolations$', LabelAdminActions.loadLabelAdmin(), '/api/v1/label-violations'],
    ['loadSettings$', LabelAdminActions.loadLabelAdmin(), '/api/v1/label-settings'],
    ['saveSettings$', LabelAdminActions.saveLabelSettings({settings: {labelValidation: 'OFF'}}), '/api/v1/label-settings'],
    ['save$', LabelAdminActions.saveLabelDefinition({key: 'qa', definition}), '/api/v1/label-definitions/qa'],
    ['delete$', LabelAdminActions.deleteLabelDefinition({key: 'qa'}), '/api/v1/label-definitions/qa']
  ] as const)('%s reports a failure', (effect, action, url) => {
    const {effects, actions$, http} = setUpEffects(LabelAdminEffects)
    const emitted = collect(effects[effect])
    actions$.next(action)
    http.expectOne(url).flush(API_ERROR, {status: 400, statusText: 'Bad Request'})
    expect(emitted.map((a) => a.type)).toEqual([backendErrorOccurred.type])
  })

  it('preview$ reports a failure', () => {
    const {effects, actions$, http} = setUpEffects(LabelAdminEffects)
    const emitted = collect(effects.preview$)
    actions$.next(LabelAdminActions.previewLabelDefinition({key: 'qa', definition}))
    http.expectOne((req) => req.url === '/api/v1/label-definitions/qa').flush(API_ERROR, {status: 400, statusText: 'Bad Request'})
    expect(emitted.map((a) => a.type)).toEqual([backendErrorOccurred.type])
  })
})
