import {TestBed} from '@angular/core/testing'
import {Paginator} from './paginator'
import {IPaginationParams} from '../core'

describe('Paginator', () => {
  const params = (currentPage: number, overrides: Partial<IPaginationParams> = {}): IPaginationParams => ({
    totalElements: 45, totalPages: 5, pageSize: 10, currentPage,
    hasPrevious: currentPage > 0, hasNext: currentPage < 4, ...overrides
  })

  async function render(paginationParams: IPaginationParams) {
    const fixture = TestBed.createComponent(Paginator)
    fixture.componentRef.setInput('paginationParams', paginationParams)
    await fixture.whenStable()
    const pages: number[] = []
    fixture.componentInstance.toPage.subscribe((page) => pages.push(page))
    const byCy = (id: string) => fixture.nativeElement.querySelector(`[data-cy-id="${id}"]`) as HTMLButtonElement
    return {byCy, pages}
  }

  it('shows which results are on the page and the page number', async () => {
    const {byCy} = await render(params(1))
    expect(byCy('paginator-range').textContent?.trim()).toBe('Showing 11–20 of 45')
    expect(byCy('paginator-current').textContent?.trim()).toBe('2 / 5')
  })

  it('ends the range at the last result on the last page, also with the page size as a string', async () => {
    const {byCy} = await render(params(1, {pageSize: '25' as unknown as number, totalPages: 2, hasNext: false}))
    expect(byCy('paginator-range').textContent?.trim()).toBe('Showing 26–45 of 45')
  })

  it('disables first and previous on the first page, next and last on the last', async () => {
    const first = await render(params(0))
    expect(first.byCy('paginator-first').disabled).toBe(true)
    expect(first.byCy('paginator-previous').disabled).toBe(true)
    expect(first.byCy('paginator-next').disabled).toBe(false)
  })

  it('asks for the first, previous, next and last page', async () => {
    const {byCy, pages} = await render(params(2))
    for (const id of ['paginator-first', 'paginator-previous', 'paginator-next', 'paginator-last']) {
      byCy(id).click()
    }
    expect(pages).toEqual([0, 1, 3, 4])
  })

  it('stays hidden without results', async () => {
    const {byCy} = await render(params(0, {totalElements: 0, totalPages: 0}))
    expect(byCy('paginator')).toBeNull()
  })
})
