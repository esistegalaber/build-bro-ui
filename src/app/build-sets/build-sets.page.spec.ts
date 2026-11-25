import {TestBed} from '@angular/core/testing'
import {provideRouter} from '@angular/router'
import {MockStore, provideMockStore} from '@ngrx/store/testing'
import {BuildSetsPage} from './build-sets.page'
import * as BuildSetActions from './state/build-sets.actions'
import {theBuildSet, theBuildSetSummaries, theSelectedBuildSetName, theSelectedSummary} from './state/build-sets.selectors'
import {build} from '../../testing/data'
import {theLabelDefinitions} from '../core'

describe('BuildSetsPage', () => {
  const summaries = [{name: 'main', projects: 2, pinned: 1}, {name: 'feature-test-stage-1', projects: 0, pinned: 0}]

  async function render(selected: string | null) {
    TestBed.configureTestingModule({
      imports: [BuildSetsPage],
      providers: [
        provideRouter([]),
        provideMockStore({
          selectors: [
            {selector: theBuildSetSummaries, value: summaries},
            {selector: theLabelDefinitions, value: []},
            {selector: theSelectedBuildSetName, value: selected},
            {selector: theSelectedSummary, value: summaries.find((s) => s.name === selected) ?? null},
            {selector: theBuildSet, value: selected ? {name: selected, builds: {backend: build(9, 'backend', 'main', 9)}} : {name: '', builds: {}}}
          ]
        })
      ]
    })
    const dispatched = vi.spyOn(TestBed.inject(MockStore), 'dispatch')
    const fixture = TestBed.createComponent(BuildSetsPage)
    await fixture.whenStable()
    const byTestId = (id: string) => fixture.nativeElement.querySelector(`[data-testid="${id}"]`) as HTMLElement
    return {fixture, dispatched, byTestId}
  }

  it('asks to choose a build set while none is selected', async () => {
    const {byTestId} = await render(null)
    expect(byTestId('build-set-none')).toBeTruthy()
    expect(byTestId('build-set-card')).toBeNull()
    expect(byTestId('build-set-add').getAttribute('href')).toBe('/edit-build-set')
  })

  it('loads the chosen build set', async () => {
    const {byTestId, dispatched} = await render(null)
    byTestId('build-set-name-main').click()
    expect(dispatched).toHaveBeenCalledWith(BuildSetActions.loadBuildSetOf({templateName: 'main'}))
  })

  it('shows the selected build set', async () => {
    const {byTestId} = await render('main')
    expect(byTestId('build-set-card').textContent).toContain('Builds of main')
    expect(byTestId('build-9')).toBeTruthy()
  })

  it('deletes only after the confirmation, which starts on Cancel', async () => {
    const {fixture, byTestId, dispatched} = await render('main')
    const dialog = byTestId('delete-confirmation-dialog')
    expect(dialog.classList).not.toContain('modal-open')
    byTestId('build-set-delete').click()
    await fixture.whenStable()
    expect(dialog.classList).toContain('modal-open')
    expect(dialog.textContent).toContain('Delete main?')
    expect(document.activeElement).toBe(byTestId('delete-cancel'))
    expect(dispatched).not.toHaveBeenCalledWith(BuildSetActions.deleteBuildSetTemplate({name: 'main'}))
    byTestId('delete-confirm').click()
    await fixture.whenStable()
    expect(dispatched).toHaveBeenCalledWith(BuildSetActions.deleteBuildSetTemplate({name: 'main'}))
    expect(dialog.classList).not.toContain('modal-open')
  })

  it.each([
    ['Cancel', (byTestId: (id: string) => HTMLElement) => byTestId('delete-cancel').click()],
    ['Escape', (byTestId: (id: string) => HTMLElement) =>
      byTestId('delete-confirmation-dialog').dispatchEvent(new KeyboardEvent('keydown', {key: 'Escape'}))]
  ])('closes the confirmation with %s without deleting', async (_, close) => {
    const {fixture, byTestId, dispatched} = await render('main')
    byTestId('build-set-delete').click()
    await fixture.whenStable()
    close(byTestId)
    await fixture.whenStable()
    expect(byTestId('delete-confirmation-dialog').classList).not.toContain('modal-open')
    expect(dispatched).not.toHaveBeenCalledWith(BuildSetActions.deleteBuildSetTemplate({name: 'main'}))
  })
})
