import {ComponentFixture, TestBed} from '@angular/core/testing'
import {provideRouter} from '@angular/router'
import {BuildSetNameForm} from './build-set-name.form'
import {EditableBuildSetTemplate} from '../../core'
import {deepFreeze} from '../../../testing/freeze'

describe('BuildSetNameForm', () => {
  let fixture: ComponentFixture<BuildSetNameForm>
  let saved: EditableBuildSetTemplate[]
  const byTestId = (id: string) => fixture.nativeElement.querySelector(`[data-testid="${id}"]`) as HTMLElement
  const text = (selector: string) => (fixture.nativeElement.querySelector(selector) as HTMLElement).textContent?.replace(/\s+/g, ' ').trim()

  async function render(name: string, savedName: string | null, cloned = false) {
    TestBed.configureTestingModule({providers: [provideRouter([])]})
    fixture = TestBed.createComponent(BuildSetNameForm)
    fixture.componentRef.setInput('editableTemplate', deepFreeze({name, projects: []}))
    fixture.componentRef.setInput('savedName', savedName)
    fixture.componentRef.setInput('cloned', cloned)
    saved = []
    fixture.componentInstance.save.subscribe((t) => saved.push(t))
    await fixture.whenStable()
  }

  async function typeName(value: string) {
    const input = byTestId('build-set-name-input') as HTMLInputElement
    input.value = value
    input.dispatchEvent(new Event('input'))
    await fixture.whenStable()
  }

  it('shows a saved build set with a Clone link', async () => {
    await render('main', 'main')
    expect(text('nav')).toBe('Build sets / main')
    expect(byTestId('build-set-title').textContent?.trim()).toBe('main')
    expect(byTestId('build-set-clone-action').getAttribute('href')).toBe('/edit-build-set/clone/main')
  })

  it('shows a new build set, without Clone and with Save disabled until it has a name', async () => {
    await render('', null)
    expect(text('nav')).toBe('Build sets / new')
    expect(byTestId('build-set-title').textContent?.trim()).toBe('New build set')
    expect(byTestId('build-set-clone-action')).toBeNull()
    expect((byTestId('build-set-save') as HTMLButtonElement).disabled).toBe(true)
    await typeName('release-1')
    expect((byTestId('build-set-save') as HTMLButtonElement).disabled).toBe(false)
    expect(byTestId('build-set-title').textContent?.trim()).toBe('release-1')
  })

  it('marks a clone in the breadcrumb', async () => {
    await render('CLONE-OF-main', null, true)
    expect(text('nav')).toBe('Build sets / clone')
  })

  it('saves with the typed name', async () => {
    await render('main', 'main')
    await typeName('main-renamed')
    byTestId('build-set-save').click()
    await fixture.whenStable()
    expect(saved).toEqual([{name: 'main-renamed', projects: []}])
    expect(fixture.componentInstance.editableTemplate().name).toBe('main')
  })

  it('keeps the typed name when other parts of the build set change', async () => {
    await render('', null)
    await typeName('release-1')
    fixture.componentRef.setInput('editableTemplate', {name: '', projects: [{id: 1, name: 'backend', active: true, branches: []}]})
    await fixture.whenStable()
    expect((byTestId('build-set-name-input') as HTMLInputElement).value).toBe('release-1')
  })

  it('takes a new name from the store, for example after loading another build set', async () => {
    await render('main', 'main')
    fixture.componentRef.setInput('editableTemplate', {name: 'feature-test-stage-1', projects: []})
    await fixture.whenStable()
    expect((byTestId('build-set-name-input') as HTMLInputElement).value).toBe('feature-test-stage-1')
  })

  it('does not save without a name, also not with Enter', async () => {
    await render('', null)
    ;(byTestId('build-set-name-input').closest('form') as HTMLFormElement).dispatchEvent(new Event('submit', {cancelable: true}))
    await fixture.whenStable()
    expect(saved).toHaveLength(0)
  })
})
