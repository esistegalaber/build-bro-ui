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
    const byCy = (id: string) => fixture.nativeElement.querySelector(`[data-cy-id="${id}"]`) as HTMLElement
    return {fixture, dispatched, byCy}
  }

  it('asks to choose a build set while none is selected', async () => {
    const {byCy} = await render(null)
    expect(byCy('build-set-none')).toBeTruthy()
    expect(byCy('build-set-card')).toBeNull()
    expect(byCy('build-set-add').getAttribute('href')).toBe('/edit-build-set')
  })

  it('loads the chosen build set', async () => {
    const {byCy, dispatched} = await render(null)
    byCy('build-set-name-main').click()
    expect(dispatched).toHaveBeenCalledWith(BuildSetActions.loadBuildSetOf({templateName: 'main'}))
  })

  it('shows the selected build set', async () => {
    const {byCy} = await render('main')
    expect(byCy('build-set-card').textContent).toContain('Builds of main')
    expect(byCy('build-9')).toBeTruthy()
  })

  it('deletes only after the confirmation, which starts on Cancel', async () => {
    const {fixture, byCy, dispatched} = await render('main')
    const dialog = byCy('delete-confirmation-dialog')
    expect(dialog.classList).not.toContain('modal-open')
    byCy('build-set-delete').click()
    await fixture.whenStable()
    expect(dialog.classList).toContain('modal-open')
    expect(dialog.textContent).toContain('Delete main?')
    expect(document.activeElement).toBe(byCy('delete-cancel'))
    expect(dispatched).not.toHaveBeenCalledWith(BuildSetActions.deleteBuildSetTemplate({name: 'main'}))
    byCy('delete-confirm').click()
    await fixture.whenStable()
    expect(dispatched).toHaveBeenCalledWith(BuildSetActions.deleteBuildSetTemplate({name: 'main'}))
    expect(dialog.classList).not.toContain('modal-open')
  })

  it.each([
    ['Cancel', (byCy: (id: string) => HTMLElement) => byCy('delete-cancel').click()],
    ['Escape', (byCy: (id: string) => HTMLElement) =>
      byCy('delete-confirmation-dialog').dispatchEvent(new KeyboardEvent('keydown', {key: 'Escape'}))]
  ])('closes the confirmation with %s without deleting', async (_, close) => {
    const {fixture, byCy, dispatched} = await render('main')
    byCy('build-set-delete').click()
    await fixture.whenStable()
    close(byCy)
    await fixture.whenStable()
    expect(byCy('delete-confirmation-dialog').classList).not.toContain('modal-open')
    expect(dispatched).not.toHaveBeenCalledWith(BuildSetActions.deleteBuildSetTemplate({name: 'main'}))
  })
})
