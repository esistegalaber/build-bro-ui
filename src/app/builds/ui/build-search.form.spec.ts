import {ComponentFixture, TestBed} from '@angular/core/testing'
import {BuildSearchForm} from './build-search.form'
import {TYPING_PAUSE_MS} from '../../ui/forms/store-draft'
import {INITIAL_BUILD_SEARCH} from '../state/builds.reducer'
import {IBuildSearchParams, ISearchData} from '../../core'
import {deepFreeze} from '../../../testing/freeze'
import {someLabelDefinitions} from '../../../testing/data'


describe('BuildSearchForm', () => {
  const available: ISearchData = {
    projectNames: ['backend', 'frontend'],
    projectBranches: {backend: ['main', 'next'], frontend: ['main']},
    labelKeys: ['part-of-build-set', 'Revision', 'release.name'],
    labelDefinitions: someLabelDefinitions()
  }
  let fixture: ComponentFixture<BuildSearchForm>
  let updates: IBuildSearchParams[]
  let resets: number
  const byCy = <T extends HTMLElement = HTMLElement>(id: string) => fixture.nativeElement.querySelector(`[data-cy-id="${id}"]`) as T

  const searchWith = (search: Partial<IBuildSearchParams> = {}) => deepFreeze({...structuredClone(INITIAL_BUILD_SEARCH.search), ...search})

  async function render(search: Partial<IBuildSearchParams> = {}) {
    fixture = TestBed.createComponent(BuildSearchForm)
    fixture.componentRef.setInput('available', available)
    fixture.componentRef.setInput('theSearch', searchWith(search))
    updates = []
    resets = 0
    fixture.componentInstance.updateSearch.subscribe((s) => updates.push(s))
    fixture.componentInstance.resetSearch.subscribe(() => resets++)
    await fixture.whenStable()
  }

  /** what the page does: the store answers with the reported search */
  async function storeAnswers() {
    fixture.componentRef.setInput('theSearch', deepFreeze(structuredClone(updates.at(-1)!)))
    await fixture.whenStable()
  }

  async function type(id: string, value: string) {
    const input = byCy<HTMLInputElement>(id)
    input.value = value
    input.dispatchEvent(new Event('input'))
    await fixture.whenStable()
  }

  async function choose(id: string, value: string) {
    const select = byCy<HTMLSelectElement>(id)
    select.value = value
    // like a browser: a select fires input, then change
    select.dispatchEvent(new Event('input'))
    select.dispatchEvent(new Event('change'))
    await fixture.whenStable()
  }

  it('offers the projects, and the branches of the chosen project', async () => {
    await render({project: 'backend'})
    const options = (id: string) => Array.from(byCy(id).querySelectorAll('option')).map((o) => o.textContent?.trim())
    expect(options('project-select')).toEqual(['All projects', 'backend', 'frontend'])
    expect(options('branch-select')).toEqual(['All branches', 'main', 'next'])
    expect(byCy<HTMLSelectElement>('project-select').value).toBe('backend')
  })

  it('searches when a project is chosen, without changing the store\'s search', async () => {
    await render()
    await choose('project-select', 'frontend')
    expect(updates).toEqual([expect.objectContaining({project: 'frontend'})])
    expect(fixture.componentInstance.theSearch().project).toBe('')
  })

  it('searches with the chosen page size as a number', async () => {
    await render()
    expect(byCy<HTMLSelectElement>('page-size-select').value).toBe('10')
    await choose('page-size-select', '25')
    expect(updates).toEqual([expect.objectContaining({pageSize: 25})])
  })

  it('searches only once per change, also after the store has answered', async () => {
    await render()
    await choose('project-select', 'frontend')
    await storeAnswers()
    await storeAnswers()
    expect(updates).toHaveLength(1)
    expect(byCy<HTMLSelectElement>('project-select').value).toBe('frontend')
  })

  it('shows a new search from the store, such as after a reset', async () => {
    await render({project: 'backend', minBuildNumber: 5})
    fixture.componentRef.setInput('theSearch', searchWith())
    await fixture.whenStable()
    expect(byCy<HTMLSelectElement>('project-select').value).toBe('')
    expect(byCy<HTMLInputElement>('min-build-number-input').value).toBe('')
    expect(updates).toHaveLength(0)
  })

  it('adds a label filter only with both key and value, and then clears the inputs', async () => {
    await render()
    const add = () => byCy<HTMLButtonElement>('label-add')
    expect(add().disabled).toBe(true)
    // a key without a definition takes any text
    await type('label-key-input', 'release.name')
    expect(add().disabled).toBe(true)
    await type('label-value-input', ' Analog-Amoeba ')
    expect(add().disabled).toBe(false)
    add().click()
    await fixture.whenStable()
    expect(updates.at(-1)?.labels).toEqual({'release.name': 'Analog-Amoeba'})
    expect(byCy<HTMLInputElement>('label-key-input').value).toBe('')
    expect(byCy<HTMLInputElement>('label-value-input').value).toBe('')
  })

  it('shows the label filters as chips, by their definition, and removes one', async () => {
    await render({labels: {'integration-test': 'ok', 'smoke': 'ok'}})
    expect(byCy('search-label').textContent).toContain('Integration test = ok')
    expect(byCy('label-chip').classList).toContain('badge-success')
    byCy('search-label-remove').click()
    await fixture.whenStable()
    expect(updates.at(-1)?.labels).toEqual({'smoke': 'ok'})
  })

  it('reloads with the current search, once per click', async () => {
    await render({project: 'backend'})
    byCy('search-reload').click()
    await fixture.whenStable()
    expect(updates).toEqual([expect.objectContaining({project: 'backend'})])
  })

  it('asks for a reset without searching', async () => {
    await render()
    byCy('search-reset').click()
    await fixture.whenStable()
    expect(resets).toBe(1)
    expect(updates).toHaveLength(0)
  })

  describe('while a build number is typed', () => {
    // fake only the timers of the debounce, so Angular's own scheduling keeps working
    beforeEach(() => vi.useFakeTimers({toFake: ['setTimeout', 'clearTimeout']}))
    afterEach(() => vi.useRealTimers())

    /** types without waiting, like a fast typist */
    function typeFast(id: string, ...values: string[]) {
      const input = byCy<HTMLInputElement>(id)
      for (const value of values) {
        input.value = value
        input.dispatchEvent(new Event('input'))
      }
    }

    async function pause(ms: number) {
      await vi.advanceTimersByTimeAsync(ms)
      await fixture.whenStable()
    }

    it('searches once, when typing has paused, with the numbers as numbers', async () => {
      await render()
      typeFast('min-build-number-input', '9', '99', '999')
      typeFast('max-build-number-input', '1', '12')
      await pause(TYPING_PAUSE_MS - 50)
      expect(updates).toHaveLength(0)
      await pause(50)
      expect(updates.at(-1)).toMatchObject({minBuildNumber: 999, maxBuildNumber: 12})
    })

    it('clears a build number when the field is emptied', async () => {
      await render({minBuildNumber: 5})
      typeFast('min-build-number-input', '')
      await pause(TYPING_PAUSE_MS)
      expect(updates.at(-1)?.minBuildNumber).toBeNull()
    })

    it('does not search for text that is no number', async () => {
      await render()
      typeFast('min-build-number-input', 'abc')
      await pause(TYPING_PAUSE_MS)
      expect(updates).toHaveLength(0)
    })

    it('does not search for keys that change nothing, such as Tab or the arrow keys', async () => {
      await render()
      byCy('min-build-number-input').dispatchEvent(new KeyboardEvent('keyup', {key: 'Tab'}))
      await pause(TYPING_PAUSE_MS)
      expect(updates).toHaveLength(0)
    })

    it('takes the typed number along on Reload, right away and only once', async () => {
      await render()
      typeFast('min-build-number-input', '5')
      byCy('search-reload').click()
      await fixture.whenStable()
      expect(updates).toEqual([expect.objectContaining({minBuildNumber: 5})])
      await pause(TYPING_PAUSE_MS)
      expect(updates).toHaveLength(1)
    })

    it('takes the typed number along when the field is left for a select', async () => {
      await render()
      typeFast('min-build-number-input', '5')
      byCy('min-build-number-input').dispatchEvent(new Event('blur'))
      await choose('project-select', 'frontend')
      expect(updates.at(-1)).toMatchObject({minBuildNumber: 5, project: 'frontend'})
    })

    it('drops the waiting number when the store sends a new search, such as after a reset', async () => {
      await render()
      typeFast('min-build-number-input', '5')
      byCy('search-reset').click()
      fixture.componentRef.setInput('theSearch', searchWith())
      await pause(TYPING_PAUSE_MS)
      expect(resets).toBe(1)
      expect(updates).toHaveLength(0)
    })

    it('drops the waiting number when the form goes away', async () => {
      await render()
      typeFast('min-build-number-input', '5')
      fixture.destroy()
      await vi.advanceTimersByTimeAsync(TYPING_PAUSE_MS)
      expect(updates).toHaveLength(0)
    })
  })

  it('suggests the keys in use and the defined ones, once each', async () => {
    await render()
    const options = Array.from(byCy('label-key-suggestions').querySelectorAll('option')).map((o) => o.value)
    expect(options).toEqual(['integration-test', 'jenkins-build', 'part-of-build-set', 'release.name', 'revision'])
    expect(byCy('label-key-input').getAttribute('list')).toBe('bb-label-keys')
  })

  it('offers the values of an enum key to choose from, with a hint', async () => {
    await render()
    await type('label-key-input', 'Integration-Test')
    const values = Array.from(byCy<HTMLSelectElement>('label-value-input').options).map((o) => o.value)
    expect(values).toEqual(['', 'ok', 'broken'])
    expect(byCy('label-value-hint').textContent).toBe('Integration test: one of ok, broken')
    const select = byCy<HTMLSelectElement>('label-value-input')
    select.value = 'broken'
    select.dispatchEvent(new Event('input'))
    select.dispatchEvent(new Event('change'))
    await fixture.whenStable()
    byCy<HTMLButtonElement>('label-add').click()
    await fixture.whenStable()
    expect(updates.at(-1)?.labels).toEqual({'Integration-Test': 'broken'})
  })

  it('marks a value that can\'t match a defined key, and doesn\'t add it', async () => {
    await render()
    await type('label-key-input', 'revision')
    expect(byCy('label-value-hint').classList).not.toContain('text-error')
    await type('label-value-input', 'abc')
    expect(byCy('label-value-hint').textContent).toBe('Revision: a value matching [0-9a-f]{64}')
    expect(byCy('label-value-hint').classList).toContain('text-error')
    expect(byCy<HTMLButtonElement>('label-add').disabled).toBe(true)
  })

  it('takes any value for a key without a definition, without a hint', async () => {
    await render()
    await type('label-key-input', 'part-of-build-set')
    await type('label-value-input', 'main')
    expect(byCy('label-value-hint')).toBeNull()
    expect(byCy<HTMLButtonElement>('label-add').disabled).toBe(false)
  })
})
