import {TestBed} from '@angular/core/testing'
import {provideRouter} from '@angular/router'
import {MockStore, provideMockStore} from '@ngrx/store/testing'
import {EditBuildSetPage} from './edit-build-set.page'
import * as EditActions from './state/edit-build-sets.actions'
import {theBuilds, theEditableBuildTemplates, theEditableTemplate, theTemplate} from './state/edit-build-sets.selectors'
import {build, someProjects} from '../../testing/data'
import {EditableBuildTemplate, IBuildSetTemplate} from '../core'

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
            {selector: theBuilds, value: [build(9, 'backend', 'main', 9)]}
          ]
        })
      ]
    })
    const dispatched = vi.spyOn(TestBed.inject(MockStore), 'dispatch')
    const fixture = TestBed.createComponent(EditBuildSetPage)
    await fixture.whenStable()
    const byCy = (id: string) => fixture.nativeElement.querySelector(`[data-cy-id="${id}"]`) as HTMLElement
    return {fixture, dispatched, byCy}
  }

  it('shows the header, the project list and what the build set resolves to', async () => {
    const {byCy} = await render({id: 1, name: 'main', buildTemplates: []})
    expect(byCy('build-set-title').textContent?.trim()).toBe('main')
    expect(byCy('build-set-clone-action')).toBeTruthy()
    expect(byCy('projects-count').textContent?.trim()).toBe('1 of 2 included')
    expect(byCy('build-9').textContent?.trim()).toBe('#9')
  })

  it('marks an unsaved clone', async () => {
    const {fixture, byCy} = await render({id: null, name: 'CLONE-OF-main', buildTemplates: []})
    expect(fixture.nativeElement.querySelector('nav').textContent).toContain('clone')
    expect(byCy('build-set-clone-action')).toBeNull()
  })

  it('turns the list and header events into actions', async () => {
    const {byCy, dispatched} = await render({id: 1, name: 'main', buildTemplates: []})
    ;(byCy('build-template-frontend').querySelector('[data-cy-id=project-toggle]') as HTMLInputElement).click()
    expect(dispatched).toHaveBeenCalledWith(EditActions.projectAdded({project: frontend}))
    ;(byCy('build-template-backend').querySelector('[data-cy-id=project-toggle]') as HTMLInputElement).click()
    expect(dispatched).toHaveBeenCalledWith(EditActions.projectRemoved({project: backend}))
    byCy('build-set-save').click()
    expect(dispatched).toHaveBeenCalledWith(EditActions.saveWith({name: 'main'}))
  })

  it('reports a changed project', async () => {
    const {fixture, byCy, dispatched} = await render({id: 1, name: 'main', buildTemplates: []})
    const number = byCy('build-template-backend').querySelector('[data-cy-id=template-build-number]') as HTMLInputElement
    number.value = '8'
    number.dispatchEvent(new Event('input'))
    // leaving the field takes the number over without waiting for the typing pause
    number.dispatchEvent(new Event('blur'))
    await fixture.whenStable()
    expect(dispatched).toHaveBeenCalledWith(EditActions.buildTemplateUpdated({buildTemplate: {...editable[0], buildNumber: 8}}))
  })
})
