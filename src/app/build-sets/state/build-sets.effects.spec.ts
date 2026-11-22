import {BuildSetsEffects} from './build-sets.effects'
import * as BuildSetActions from './build-sets.actions'
import {backendErrorOccurred} from '../../core/state/alerts/alert.actions'
import {API_ERROR, collect, setUpEffects} from '../../../testing/effects'
import {build} from '../../../testing/data'

describe('BuildSetsEffects', () => {
  const setUp = () => setUpEffects(BuildSetsEffects)

  it('loads all build sets with their projects', () => {
    const {effects, actions$, http} = setUp()
    const emitted = collect(effects.loadTemplates$)
    actions$.next(BuildSetActions.loadBuildSetTemplates())
    const templates = [{id: 1, name: 'main', buildTemplates: []}]
    http.expectOne({method: 'GET', url: '/api/v1/build-sets'}).flush(templates)
    expect(emitted).toEqual([BuildSetActions.buildSetTemplatesLoaded({templates})])
    http.verify()
  })

  it('loads the builds a build set resolves to, with the name encoded', () => {
    const {effects, actions$, http} = setUp()
    const emitted = collect(effects.buildsOf$)
    actions$.next(BuildSetActions.loadBuildSetOf({templateName: 'Environment of StageServer'}))
    const buildSet = {name: 'Environment of StageServer', builds: {backend: build(9, 'backend', 'main', 9)}}
    http.expectOne({method: 'GET', url: '/api/v1/build-sets/of/Environment%20of%20StageServer'}).flush(buildSet)
    expect(emitted).toEqual([BuildSetActions.buildSetLoaded({buildSet})])
  })

  it('deletes a build set and reports which one', () => {
    const {effects, actions$, http} = setUp()
    const emitted = collect(effects.delete$)
    actions$.next(BuildSetActions.deleteBuildSetTemplate({name: 'main'}))
    http.expectOne({method: 'DELETE', url: '/api/v1/build-sets/main'}).flush(null)
    expect(emitted).toEqual([BuildSetActions.buildSetTemplateDeleted({name: 'main'})])
  })

  it.each([
    ['loading the build sets', 'loadTemplates$', BuildSetActions.loadBuildSetTemplates(), '/api/v1/build-sets'],
    ['loading a build set', 'buildsOf$', BuildSetActions.loadBuildSetOf({templateName: 'x'}), '/api/v1/build-sets/of/x'],
    ['deleting a build set', 'delete$', BuildSetActions.deleteBuildSetTemplate({name: 'x'}), '/api/v1/build-sets/x']
  ] as const)('reports a failure when %s', (_, effect, trigger, url) => {
    const {effects, actions$, http} = setUp()
    const emitted = collect(effects[effect])
    actions$.next(trigger)
    http.expectOne(url).flush(API_ERROR, {status: 404, statusText: 'Not Found'})
    expect(emitted.map((a) => a.type)).toEqual([backendErrorOccurred.type])
  })
})
