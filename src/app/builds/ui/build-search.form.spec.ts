import {ComponentFixture, TestBed} from '@angular/core/testing'
import {BuildSearchForm} from './build-search.form'
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

  async function type(id: string, value: string, event = 'input') {
    const input = byCy(id) as HTMLInputElement
    input.value = value
    input.dispatchEvent(new Event('input'))
    if (event !== 'input') {
      input.dispatchEvent(new Event(event))
    }
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

  it('searches while a build number is typed', async () => {
    await render()
    await type('min-build-number-input', '5', 'keyup')
    await type('max-build-number-input', '9', 'keyup')
    expect(updates.at(-1)).toMatchObject({minBuildNumber: '5', maxBuildNumber: '9'})
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
