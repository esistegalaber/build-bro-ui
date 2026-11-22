import {ComponentFixture, TestBed} from '@angular/core/testing'
import {BuildTemplateForm} from './build-template.form'
import {EditableBuildTemplate, IProject} from '../../core'
import {someProjects} from '../../../testing/data'

describe('BuildTemplateForm', () => {
  const backend = someProjects()[0]
  let fixture: ComponentFixture<BuildTemplateForm>
  let updated: EditableBuildTemplate[]
  const byCy = (id: string) => fixture.nativeElement.querySelector(`[data-cy-id="${id}"]`) as HTMLElement
  const field = (name: string) => fixture.nativeElement.querySelector(`[name="${name}"]`) as HTMLInputElement

  async function render(template: Partial<EditableBuildTemplate>) {
    fixture = TestBed.createComponent(BuildTemplateForm)
    fixture.componentRef.setInput('template', {
      project: backend, projectSelected: true, branch: backend.branches[0], buildNumber: null, labels: {}, ...template
    })
    updated = []
    fixture.componentInstance.templateUpdated.subscribe((t) => updated.push(structuredClone(t)))
    await fixture.whenStable()
  }

  async function change(element: HTMLInputElement | HTMLSelectElement, value: string) {
    element.value = value
    element.dispatchEvent(new Event(element instanceof HTMLSelectElement ? 'change' : 'input'))
    element.dispatchEvent(new Event('change'))
    await fixture.whenStable()
  }

  it('shows an included project with its branch, build number and label filter', async () => {
    await render({buildNumber: 9, labels: {'integration-test': 'ok'}})
    expect((byCy('project-toggle') as HTMLInputElement).checked).toBe(true)
    expect((byCy('template-branch-select') as HTMLSelectElement).selectedOptions[0].textContent?.trim()).toBe('main')
    expect(field('buildNumber').value).toBe('9')
    expect(field('labels').value).toBe('integration-test=ok')
    expect(byCy('template-pinned')).toBeTruthy()
  })

  it('shows an excluded project as one line without fields', async () => {
    await render({projectSelected: false, branch: null})
    expect(fixture.nativeElement.textContent).toContain('Not included')
    expect(byCy('template-branch-select')).toBeNull()
    expect(field('buildNumber')).toBeNull()
  })

  it('offers the project branches and a "Choose a branch" entry', async () => {
    await render({})
    const options = Array.from((byCy('template-branch-select') as HTMLSelectElement).options).map((o) => o.textContent?.trim())
    expect(options).toEqual(['Choose a branch', 'main', 'next', 'merged-feature'])
  })

  it('asks to add or remove the project', async () => {
    const added: IProject[] = []
    const removed: IProject[] = []
    await render({projectSelected: false, branch: null})
    fixture.componentInstance.projectAdded.subscribe((p) => added.push(p))
    fixture.componentInstance.projectRemoved.subscribe((p) => removed.push(p))
    byCy('project-toggle').click()
    expect(added.map((p) => p.name)).toEqual(['backend'])
    fixture.componentRef.setInput('template', {...fixture.componentInstance.template, projectSelected: true})
    await fixture.whenStable()
    byCy('project-toggle').click()
    expect(removed.map((p) => p.name)).toEqual(['backend'])
  })

  it('reports a new branch, build number and label filter', async () => {
    await render({})
    const select = byCy('template-branch-select') as HTMLSelectElement
    await change(select, select.options[2].value)
    expect(updated.at(-1)?.branch?.name).toBe('next')
    await change(field('buildNumber'), '7')
    expect(updated.at(-1)?.buildNumber).toBe(7)
    await change(field('labels'), 'integration-test = ok, release.name=Analog-Amoeba')
    expect(updated.at(-1)?.labels).toEqual({'integration-test': 'ok', 'release.name': 'Analog-Amoeba'})
  })
})
