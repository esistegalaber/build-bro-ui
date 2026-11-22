import {ComponentFixture, TestBed} from '@angular/core/testing'
import {BuildSearchForm, TYPING_PAUSE_MS} from './build-search.form'
import {INITIAL_BUILD_SEARCH} from '../state/builds.reducer'
import {IBuildSearchParams, ISearchData} from '../../core'

describe('BuildSearchForm', () => {
  const available: ISearchData = {
    projectNames: ['backend', 'frontend'],
    projectBranches: {backend: ['main', 'next'], frontend: ['main']},
    labelKeys: []
  }
  let fixture: ComponentFixture<BuildSearchForm>
  let updates: IBuildSearchParams[]
  const byCy = (id: string) => fixture.nativeElement.querySelector(`[data-cy-id="${id}"]`) as HTMLElement

  async function render(search: Partial<IBuildSearchParams> = {}) {
    fixture = TestBed.createComponent(BuildSearchForm)
    fixture.componentRef.setInput('available', available)
    fixture.componentRef.setInput('theSearch', structuredClone({...INITIAL_BUILD_SEARCH.search, ...search}))
    updates = []
    fixture.componentInstance.updateSearch.subscribe((s) => updates.push(structuredClone(s)))
    await fixture.whenStable()
  }

  async function type(id: string, value: string) {
    const input = byCy(id) as HTMLInputElement
    input.value = value
    input.dispatchEvent(new Event('input'))
    await fixture.whenStable()
  }

  async function choose(id: string, value: string) {
    const select = byCy(id) as HTMLSelectElement
    select.value = value
    select.dispatchEvent(new Event('change'))
    await fixture.whenStable()
  }

  it('offers the projects, and the branches of the chosen project', async () => {
    await render({project: 'backend'})
    const options = (id: string) => Array.from(byCy(id).querySelectorAll('option')).map((o) => o.textContent?.trim())
    expect(options('project-select')).toEqual(['All projects', 'backend', 'frontend'])
    expect(options('branch-select')).toEqual(['All branches', 'main', 'next'])
  })

  it('searches when a project is chosen', async () => {
    await render()
    await choose('project-select', 'frontend')
    expect(updates.at(-1)?.project).toBe('frontend')
  })

  describe('while a build number is typed', () => {
    // fake only the timers of the form, so Angular's own scheduling keeps working
    beforeEach(() => vi.useFakeTimers({toFake: ['setTimeout', 'clearTimeout']}))
    afterEach(() => vi.useRealTimers())

    /** types without waiting, like a fast typist: ngModel takes each value right away */
    function typeFast(id: string, ...values: string[]) {
      const input = byCy(id) as HTMLInputElement
      for (const value of values) {
        input.value = value
        input.dispatchEvent(new Event('input'))
      }
    }

    it('searches once, when typing has paused', async () => {
      await render()
      typeFast('min-build-number-input', '9', '99', '999')
      typeFast('max-build-number-input', '1', '12')
      vi.advanceTimersByTime(TYPING_PAUSE_MS - 1)
      expect(updates).toHaveLength(0)
      vi.advanceTimersByTime(1)
      expect(updates).toEqual([expect.objectContaining({minBuildNumber: '999', maxBuildNumber: '12'})])
    })

    it('does not search for keys that change nothing, such as Tab or the arrow keys', async () => {
      await render()
      byCy('min-build-number-input').dispatchEvent(new KeyboardEvent('keyup', {key: 'Tab'}))
      vi.advanceTimersByTime(TYPING_PAUSE_MS)
      expect(updates).toHaveLength(0)
    })

    it.each([
      ['a project is chosen', () => {
        const select = byCy('project-select') as HTMLSelectElement
        select.value = 'frontend'
        select.dispatchEvent(new Event('change'))
      }],
      ['Reload is clicked', () => byCy('search-reload').click()]
    ])('searches right away, and only once, when %s meanwhile', async (_, act) => {
      await render()
      typeFast('min-build-number-input', '5')
      act()
      expect(updates).toEqual([expect.objectContaining({minBuildNumber: '5'})])
      vi.advanceTimersByTime(TYPING_PAUSE_MS)
      expect(updates).toHaveLength(1)
    })

    it('drops the waiting search on reset', async () => {
      await render()
      let resets = 0
      fixture.componentInstance.resetSearch.subscribe(() => resets++)
      typeFast('min-build-number-input', '5')
      byCy('search-reset').click()
      vi.advanceTimersByTime(TYPING_PAUSE_MS)
      expect(resets).toBe(1)
      expect(updates).toHaveLength(0)
    })

    it('drops the waiting search when the form goes away', async () => {
      await render()
      typeFast('min-build-number-input', '5')
      fixture.destroy()
      vi.advanceTimersByTime(TYPING_PAUSE_MS)
      expect(updates).toHaveLength(0)
    })
  })

  it('adds a label filter only with both key and value, and then clears the inputs', async () => {
    await render()
    const add = () => byCy('label-add') as HTMLButtonElement
    expect(add().disabled).toBe(true)
    await type('label-key-input', 'integration-test')
    expect(add().disabled).toBe(true)
    await type('label-value-input', ' ok ')
    expect(add().disabled).toBe(false)
    add().click()
    await fixture.whenStable()
    expect(updates.at(-1)?.labels).toEqual({'integration-test': 'ok'})
    expect((byCy('label-key-input') as HTMLInputElement).value).toBe('')
  })

  it('shows the label filters as chips and removes one', async () => {
    await render({labels: {'integration-test': 'ok'}})
    expect(byCy('search-label').textContent).toContain('integration-test = ok')
    byCy('search-label-remove').click()
    await fixture.whenStable()
    expect(updates.at(-1)?.labels).toEqual({})
    expect(byCy('search-label')).toBeNull()
  })

  it('reloads with the current search, once per click', async () => {
    await render({project: 'backend'})
    byCy('search-reload').click()
    expect(updates).toHaveLength(1)
    expect(updates[0].project).toBe('backend')
  })

  it('asks for a reset without searching', async () => {
    await render()
    let resets = 0
    fixture.componentInstance.resetSearch.subscribe(() => resets++)
    byCy('search-reset').click()
    expect(resets).toBe(1)
    expect(updates).toHaveLength(0)
  })
})
