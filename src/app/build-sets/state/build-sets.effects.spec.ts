import {provideRouter} from '@angular/router'
import {BuildSetsEffects} from './build-sets.effects'
import * as BuildSetActions from './build-sets.actions'
import {backendErrorOccurred} from '../../core/state/alerts/alert.actions'
import {API_ERROR, collect, setUpEffects} from '../../../testing/effects'
import {build} from '../../../testing/data'

describe('BuildSetsEffects', () => {
  const setUp = () => setUpEffects(BuildSetsEffects, {providers: [provideRouter([])]})

  it('loads the build set names', () => {
    const {effects, actions$, http} = setUp()
    const emitted = collect(effects.loadKnownTemplateNames)
    actions$.next(BuildSetActions.loadBuildSetNames())
    http.expectOne({method: 'GET', url: '/api/v1/build-sets/names'}).flush(['main'])
    expect(emitted).toEqual([BuildSetActions.buildSetNamesLoaded({names: ['main']})])
    http.verify()
  })

  it('loads the builds a build set resolves to', () => {
    const {effects, actions$, http} = setUp()
    const emitted = collect(effects.buildsOf$)
    actions$.next(BuildSetActions.loadBuildSetOf({templateName: 'Environment of StageServer'}))
    const buildSet = {name: 'Environment of StageServer', builds: {backend: build(9, 'backend', 'main', 9)}}
    http.expectOne({method: 'GET', url: '/api/v1/build-sets/of/Environment of StageServer'}).flush(buildSet)
    expect(emitted).toEqual([BuildSetActions.buildSetLoaded({buildSet})])
  })

  it('deletes a build set and reloads the names', () => {
    const {effects, actions$, http} = setUp()
    const emitted = collect(effects.delete$)
    actions$.next(BuildSetActions.deleteBuildSetTemplate({name: 'main'}))
    http.expectOne({method: 'DELETE', url: '/api/v1/build-sets/main'}).flush(null)
    expect(emitted).toEqual([BuildSetActions.loadBuildSetNames()])
  })

  it.each([
    ['loading the names', 'loadKnownTemplateNames', BuildSetActions.loadBuildSetNames(), '/api/v1/build-sets/names'],
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
