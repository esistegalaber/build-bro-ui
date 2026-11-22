import {TestBed} from '@angular/core/testing'
import {MockStore, provideMockStore} from '@ngrx/store/testing'
import {BuildsPage} from './builds.page'
import * as BuildActions from './state/builds.actions'
import {searchData, theBuilds, theBuildSearchPaginationParams, theBuildSearchParams} from './state/builds.selectors'
import {INITIAL_BUILD_SEARCH} from './state/builds.reducer'
import {build} from '../../testing/data'
import {IBuild, IPaginationParams} from '../core'

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
          {selector: searchData, value: {projectNames: ['backend'], projectBranches: {backend: ['main']}, labelKeys: []}},
          {selector: theBuildSearchParams, value: INITIAL_BUILD_SEARCH.search},
          {selector: theBuilds, value: builds},
          {selector: theBuildSearchPaginationParams, value: pagination(total)}
        ]
      })]
    })
    const dispatched = vi.spyOn(TestBed.inject(MockStore), 'dispatch')
    const fixture = TestBed.createComponent(BuildsPage)
    await fixture.whenStable()
    const byCy = (id: string) => fixture.nativeElement.querySelector(`[data-cy-id="${id}"]`) as HTMLElement
    return {fixture, dispatched, byCy}
  }

  it('searches when it opens', async () => {
    const {dispatched} = await render([], 0)
    expect(dispatched).toHaveBeenCalledWith(BuildActions.doBuildSearch())
  })

  it('shows the number of builds, the rows and the paginator', async () => {
    const {byCy} = await render([build(10, 'backend', 'main', 10), build(9, 'backend', 'main', 9)], 45)
    expect(byCy('builds-count').textContent?.trim()).toBe('45 builds')
    expect(byCy('build-10')).toBeTruthy()
    expect(byCy('paginator-range').textContent?.trim()).toBe('Showing 1–10 of 45')
  })

  it('says "1 build" for a single result', async () => {
    const {byCy} = await render([build(10, 'backend', 'main', 10)], 1)
    expect(byCy('builds-count').textContent?.trim()).toBe('1 build')
  })

  it('shows an empty state that resets the filters', async () => {
    const {byCy, dispatched} = await render([], 0)
    expect(byCy('builds-empty').textContent).toContain('No builds match these filters.')
    expect(byCy('paginator')).toBeNull()
    ;(byCy('builds-empty').querySelector('button') as HTMLButtonElement).click()
    expect(dispatched).toHaveBeenCalledWith(BuildActions.resetSearchParams())
  })

  it('turns form and paginator events into actions', async () => {
    const {byCy, dispatched} = await render([build(10, 'backend', 'main', 10)], 45)
    byCy('paginator-next').click()
    expect(dispatched).toHaveBeenCalledWith(BuildActions.toSearchPage({page: 1}))
    byCy('search-reset').click()
    expect(dispatched).toHaveBeenCalledWith(BuildActions.resetSearchParams())
    byCy('search-reload').click()
    expect(dispatched).toHaveBeenCalledWith(BuildActions.updateSearchParams({search: INITIAL_BUILD_SEARCH.search}))
  })
})
