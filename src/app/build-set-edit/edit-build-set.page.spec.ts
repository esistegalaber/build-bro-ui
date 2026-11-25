import {TestBed} from '@angular/core/testing'
import {provideRouter} from '@angular/router'
import {MockStore, provideMockStore} from '@ngrx/store/testing'
import {EditBuildSetPage} from './edit-build-set.page'
import * as EditActions from './state/edit-build-sets.actions'
import {theBuilds, theEditableBuildTemplates, theEditableTemplate, theTemplate} from './state/edit-build-sets.selectors'
import {build, someProjects} from '../../testing/data'
import {EditableBuildTemplate, IBuildSetTemplate, theLabelDefinitions} from '../core'

describe('EditBuildSetPage', () => {
  const [backend, frontend] = someProjects()
  const editable: EditableBuildTemplate[] = [
    {project: backend, projectSelected: true, branch: backend.branches[0], buildNumber: 9, labels: {}},
    {project: frontend, projectSelected: false, branch: null, buildNumber: null, labels: {}}
  ]

  async function render(saved: IBuildSetTemplate) {
    TestBed.configureTestingModule({
      imports: [EditBuildSetPage],
      providers: [
        provideRouter([]),
        provideMockStore({
          selectors: [
            {selector: theTemplate, value: saved},
            {selector: theEditableTemplate, value: {name: saved.name, projects: [backend]}},
            {selector: theEditableBuildTemplates, value: editable},
            {selector: theBuilds, value: [build(9, 'backend', 'main', 9)]},
            {selector: theLabelDefinitions, value: []}
          ]
        })
      ]
    })
    const dispatched = vi.spyOn(TestBed.inject(MockStore), 'dispatch')
    const fixture = TestBed.createComponent(EditBuildSetPage)
    await fixture.whenStable()
    const byTestId = (id: string) => fixture.nativeElement.querySelector(`[data-testid="${id}"]`) as HTMLElement
    return {fixture, dispatched, byTestId}
  }

  it('shows the header, the project list and what the build set resolves to', async () => {
    const {byTestId} = await render({id: 1, name: 'main', buildTemplates: []})
    expect(byTestId('build-set-title').textContent?.trim()).toBe('main')
    expect(byTestId('build-set-clone-action')).toBeTruthy()
    expect(byTestId('projects-count').textContent?.trim()).toBe('1 of 2 included')
    expect(byTestId('build-9').textContent?.trim()).toBe('#9')
  })

  it('marks an unsaved clone', async () => {
    const {fixture, byTestId} = await render({id: null, name: 'CLONE-OF-main', buildTemplates: []})
    expect(fixture.nativeElement.querySelector('nav').textContent).toContain('clone')
    expect(byTestId('build-set-clone-action')).toBeNull()
  })

  it('turns the list and header events into actions', async () => {
    const {byTestId, dispatched} = await render({id: 1, name: 'main', buildTemplates: []})
    ;(byTestId('build-template-frontend').querySelector('[data-testid=project-toggle]') as HTMLInputElement).click()
    expect(dispatched).toHaveBeenCalledWith(EditActions.projectAdded({project: frontend}))
    ;(byTestId('build-template-backend').querySelector('[data-testid=project-toggle]') as HTMLInputElement).click()
    expect(dispatched).toHaveBeenCalledWith(EditActions.projectRemoved({project: backend}))
    byTestId('build-set-save').click()
    expect(dispatched).toHaveBeenCalledWith(EditActions.saveWith({name: 'main'}))
  })

  it('reports a changed project', async () => {
    const {fixture, byTestId, dispatched} = await render({id: 1, name: 'main', buildTemplates: []})
    const number = byTestId('build-template-backend').querySelector('[data-testid=template-build-number]') as HTMLInputElement
    number.value = '8'
    number.dispatchEvent(new Event('input'))
    // leaving the field takes the number over without waiting for the typing pause
    number.dispatchEvent(new Event('blur'))
    await fixture.whenStable()
    expect(dispatched).toHaveBeenCalledWith(EditActions.buildTemplateUpdated({buildTemplate: {...editable[0], buildNumber: 8}}))
  })
})
