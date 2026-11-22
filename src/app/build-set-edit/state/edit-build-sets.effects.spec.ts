import {provideRouter} from '@angular/router'
import {EditBuildSetsEffects} from './edit-build-sets.effects'
import * as EditActions from './edit-build-sets.actions'
import {theBuildTemplates, theTemplate} from './edit-build-sets.selectors'
import {backendErrorOccurred, frontendInfo} from '../../core/state/alerts/alert.actions'
import {API_ERROR, collect, setUpEffects} from '../../../testing/effects'
import {build, someProjects} from '../../../testing/data'
import {IBuildSetTemplate} from '../../core'

describe('EditBuildSetsEffects', () => {
  const template: IBuildSetTemplate = {
    id: 1, name: 'main', buildTemplates: [{id: 1, project: 'backend', branch: 'main', buildNumber: 9, labels: {}}]
  }
  const setUp = () => setUpEffects(EditBuildSetsEffects, {
    providers: [provideRouter([])],
    selectors: [
      {selector: theTemplate, value: template},
      {selector: theBuildTemplates, value: template.buildTemplates}
    ]
  })

  it('loads a template to edit', () => {
    const {effects, actions$, http} = setUp()
    const emitted = collect(effects.loadBuildSetTemplate$)
    actions$.next(EditActions.loadBuildSetTemplate({name: 'main'}))
    http.expectOne({method: 'GET', url: '/api/v1/build-sets/main'}).flush(template)
    expect(emitted).toEqual([EditActions.buildSetTemplateLoaded({theTemplate: template})])
    http.verify()
  })

  it('loads a template to clone', () => {
    const {effects, actions$, http} = setUp()
    const emitted = collect(effects.loadBuildSetTemplateToClone$)
    actions$.next(EditActions.loadBuildSetTemplateToClone({name: 'main'}))
    http.expectOne({method: 'GET', url: '/api/v1/build-sets/main'}).flush(template)
    expect(emitted).toEqual([EditActions.buildSetTemplateToCloneLoaded({theTemplate: template})])
  })

  it.each([
    ['a template was loaded', EditActions.buildSetTemplateLoaded({theTemplate: template})],
    ['a project changed', EditActions.buildTemplateUpdated({
      buildTemplate: {project: someProjects()[0], projectSelected: true, branch: null, buildNumber: null, labels: {}}
    })]
  ])('verifies the current build templates after %s', (_, trigger) => {
    const {effects, actions$, http} = setUp()
    const emitted = collect(effects.verifyBuildsOfEnv$)
    actions$.next(trigger)
    const req = http.expectOne({method: 'POST', url: '/api/v1/build-sets/verify'})
    expect(req.request.body).toEqual(template.buildTemplates)
    const buildSet = {name: 'verification-result', builds: {backend: build(9, 'backend', 'main', 9)}}
    req.flush(buildSet)
    expect(emitted).toEqual([EditActions.buildSetLoaded({buildSet})])
  })

  it('saves the template, shows a confirmation and takes the saved template', () => {
    const {effects, actions$, http, store} = setUp()
    const dispatched = vi.spyOn(store, 'dispatch')
    const emitted = collect(effects.save$)
    actions$.next(EditActions.saveWith({name: 'main'}))
    const req = http.expectOne({method: 'POST', url: '/api/v1/build-sets'})
    expect(req.request.body).toEqual(template)
    const saved = {...template, id: 7}
    req.flush(saved)
    expect(emitted).toEqual([EditActions.buildSetTemplateLoaded({theTemplate: saved})])
    expect(dispatched).toHaveBeenCalledWith(frontendInfo({
      alertMessage: {heading: 'Saved', message: 'Successfully saved BuildSet Template with id = 7'}
    }))
  })

  it.each([
    ['loading a template', 'loadBuildSetTemplate$', EditActions.loadBuildSetTemplate({name: 'x'}), '/api/v1/build-sets/x'],
    ['loading a template to clone', 'loadBuildSetTemplateToClone$', EditActions.loadBuildSetTemplateToClone({name: 'x'}), '/api/v1/build-sets/x'],
    ['verifying', 'verifyBuildsOfEnv$', EditActions.buildSetTemplateLoaded({theTemplate: template}), '/api/v1/build-sets/verify'],
    ['saving', 'save$', EditActions.saveWith({name: 'main'}), '/api/v1/build-sets']
  ] as const)('reports a failure when %s', (_, effect, trigger, url) => {
    const {effects, actions$, http} = setUp()
    const emitted = collect(effects[effect])
    actions$.next(trigger)
    http.expectOne(url).flush(API_ERROR, {status: 404, statusText: 'Not Found'})
    expect(emitted.map((a) => a.type)).toEqual([backendErrorOccurred.type])
  })
})
