import {TestBed} from '@angular/core/testing'
import {MockStore, provideMockStore} from '@ngrx/store/testing'
import {BuildsPage} from './builds.page'
import * as BuildActions from './state/builds.actions'
import {searchData, theBuilds, theBuildSearchPaginationParams, theBuildSearchParams} from './state/builds.selectors'
import {INITIAL_BUILD_SEARCH} from './state/builds.reducer'
import {build} from '../../testing/data'
import {IBuild, IPaginationParams} from '../core'
import {theLabelDefinitions} from '../core'

describe('BuildsPage', () => {
  const pagination = (totalElements: number): IPaginationParams => ({
    totalElements, totalPages: Math.ceil(totalElements / 10), pageSize: 10, currentPage: 0,
    hasPrevious: false, hasNext: totalElements > 10
  })

  async function render(builds: IBuild[], total: number) {
    TestBed.configureTestingModule({
      imports: [BuildsPage],
      providers: [provideMockStore({
        selectors: [
          {selector: searchData, value: {projectNames: ['backend'], projectBranches: {backend: ['main']}, labelKeys: [], labelDefinitions: []}},
          {selector: theLabelDefinitions, value: []},
          {selector: theBuildSearchParams, value: INITIAL_BUILD_SEARCH.search},
          {selector: theBuilds, value: builds},
          {selector: theBuildSearchPaginationParams, value: pagination(total)}
        ]
      })]
    })
    const dispatched = vi.spyOn(TestBed.inject(MockStore), 'dispatch')
    const fixture = TestBed.createComponent(BuildsPage)
    await fixture.whenStable()
    const byTestId = (id: string) => fixture.nativeElement.querySelector(`[data-testid="${id}"]`) as HTMLElement
    return {fixture, dispatched, byTestId}
  }

  it('searches when it opens, and loads the label keys for the filter', async () => {
    const {dispatched} = await render([], 0)
    expect(dispatched).toHaveBeenCalledWith(BuildActions.doBuildSearch())
    expect(dispatched).toHaveBeenCalledWith(BuildActions.loadAvailableBuildSearchData())
  })

  it('shows the number of builds, the rows and the paginator', async () => {
    const {byTestId} = await render([build(10, 'backend', 'main', 10), build(9, 'backend', 'main', 9)], 45)
    expect(byTestId('builds-count').textContent?.trim()).toBe('45 builds')
    expect(byTestId('build-10')).toBeTruthy()
    expect(byTestId('paginator-range').textContent?.trim()).toBe('Showing 1–10 of 45')
  })

  it('says "1 build" for a single result', async () => {
    const {byTestId} = await render([build(10, 'backend', 'main', 10)], 1)
    expect(byTestId('builds-count').textContent?.trim()).toBe('1 build')
  })

  it('shows an empty state that resets the filters', async () => {
    const {byTestId, dispatched} = await render([], 0)
    expect(byTestId('builds-empty').textContent).toContain('No builds match these filters.')
    expect(byTestId('paginator')).toBeNull()
    ;(byTestId('builds-empty').querySelector('button') as HTMLButtonElement).click()
    expect(dispatched).toHaveBeenCalledWith(BuildActions.resetSearchParams())
  })

  it('turns form and paginator events into actions', async () => {
    const {byTestId, dispatched} = await render([build(10, 'backend', 'main', 10)], 45)
    byTestId('paginator-next').click()
    expect(dispatched).toHaveBeenCalledWith(BuildActions.toSearchPage({page: 1}))
    byTestId('search-reset').click()
    expect(dispatched).toHaveBeenCalledWith(BuildActions.resetSearchParams())
    byTestId('search-reload').click()
    expect(dispatched).toHaveBeenCalledWith(BuildActions.updateSearchParams({search: INITIAL_BUILD_SEARCH.search}))
  })
})
