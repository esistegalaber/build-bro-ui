import {ComponentFixture, TestBed} from '@angular/core/testing'
import {BuildTemplateForm} from './build-template.form'
import {EditableBuildTemplate, IProject} from '../../core'
import {someProjects} from '../../../testing/data'
import {deepFreeze} from '../../../testing/freeze'
import {TYPING_PAUSE_MS} from '../../ui/forms/store-draft'

describe('BuildTemplateForm', () => {
  const backend = someProjects()[0]
  let fixture: ComponentFixture<BuildTemplateForm>
  let updated: EditableBuildTemplate[]
  const byCy = <T extends HTMLElement = HTMLElement>(id: string) => fixture.nativeElement.querySelector(`[data-cy-id="${id}"]`) as T
  const rowWith = (template: Partial<EditableBuildTemplate>) => deepFreeze({
    project: backend, projectSelected: true, branch: backend.branches[0], buildNumber: null, labels: {}, ...structuredClone(template)
  } as EditableBuildTemplate)

  async function render(template: Partial<EditableBuildTemplate>) {
    fixture = TestBed.createComponent(BuildTemplateForm)
    fixture.componentRef.setInput('template', rowWith(template))
    updated = []
    fixture.componentInstance.templateUpdated.subscribe((t) => updated.push(t))
    await fixture.whenStable()
  }

  /** like a browser: input while typing or choosing, change and blur when done */
  async function change(element: HTMLInputElement | HTMLSelectElement, value: string) {
    element.value = value
    element.dispatchEvent(new Event('input'))
    element.dispatchEvent(new Event('change'))
    element.dispatchEvent(new Event('blur'))
    await fixture.whenStable()
  }

  it('shows an included project with its branch, build number and label filter', async () => {
    await render({buildNumber: 9, labels: {'integration-test': 'ok'}})
    expect(byCy<HTMLInputElement>('project-toggle').checked).toBe(true)
    expect(byCy<HTMLSelectElement>('template-branch-select').selectedOptions[0].textContent?.trim()).toBe('main')
    expect(byCy<HTMLInputElement>('template-build-number').value).toBe('9')
    expect(byCy<HTMLInputElement>('template-labels').value).toBe('integration-test=ok')
    expect(byCy('template-pinned')).toBeTruthy()
  })

  it('shows an excluded project as one line without fields', async () => {
    await render({projectSelected: false, branch: null})
    expect(fixture.nativeElement.textContent).toContain('Not included')
    expect(byCy('template-branch-select')).toBeNull()
    expect(byCy('template-build-number')).toBeNull()
  })

  it('offers the project branches and a "Choose a branch" entry', async () => {
    await render({branch: null})
    const select = byCy<HTMLSelectElement>('template-branch-select')
    expect(Array.from(select.options).map((o) => o.textContent?.trim())).toEqual(['Choose a branch', 'main', 'next', 'merged-feature'])
    expect(select.value).toBe('')
  })

  it('asks to add or remove the project', async () => {
    const added: IProject[] = []
    const removed: IProject[] = []
    await render({projectSelected: false, branch: null})
    fixture.componentInstance.projectAdded.subscribe((p) => added.push(p))
    fixture.componentInstance.projectRemoved.subscribe((p) => removed.push(p))
    byCy('project-toggle').click()
    expect(added.map((p) => p.name)).toEqual(['backend'])
    fixture.componentRef.setInput('template', rowWith({projectSelected: true}))
    await fixture.whenStable()
    byCy('project-toggle').click()
    expect(removed.map((p) => p.name)).toEqual(['backend'])
  })

  it('reports a new branch and label filter as new rows, without changing its input', async () => {
    await render({})
    await change(byCy('template-branch-select'), 'next')
    expect(updated.at(-1)?.branch?.name).toBe('next')
    await change(byCy('template-labels'), 'integration-test = ok, release.name=Analog-Amoeba')
    expect(updated.at(-1)).toMatchObject({branch: {name: 'next'}, labels: {'integration-test': 'ok', 'release.name': 'Analog-Amoeba'}})
    expect(updated).toHaveLength(2)
    expect(fixture.componentInstance.template().branch?.name).toBe('main')
  })

  it('reports a typed build number once typing has paused, or when the field is left', async () => {
    vi.useFakeTimers({toFake: ['setTimeout', 'clearTimeout']})
    try {
      await render({})
      const number = byCy<HTMLInputElement>('template-build-number')
      for (const value of ['1', '12']) {
        number.value = value
        number.dispatchEvent(new Event('input'))
      }
      await vi.advanceTimersByTimeAsync(TYPING_PAUSE_MS)
      await fixture.whenStable()
      expect(updated).toEqual([expect.objectContaining({buildNumber: 12})])

      number.value = ''
      number.dispatchEvent(new Event('input'))
      number.dispatchEvent(new Event('blur'))
      await fixture.whenStable()
      expect(updated.at(-1)?.buildNumber).toBeNull()
    } finally {
      vi.useRealTimers()
    }
  })

  it('shows the values of a new row from the store, such as after switching the build set', async () => {
    await render({buildNumber: 9})
    fixture.componentRef.setInput('template', rowWith({projectSelected: false, branch: null}))
    await fixture.whenStable()
    expect(fixture.nativeElement.textContent).toContain('Not included')
    fixture.componentRef.setInput('template', rowWith({branch: backend.branches[1], buildNumber: 3}))
    await fixture.whenStable()
    expect(byCy<HTMLSelectElement>('template-branch-select').value).toBe('next')
    expect(byCy<HTMLInputElement>('template-build-number').value).toBe('3')
    expect(updated).toHaveLength(0)
  })
})
