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
    const byTestId = (id: string) => fixture.nativeElement.querySelector(`[data-testid="${id}"]`) as HTMLButtonElement
    return {byTestId, pages}
  }

  it('shows which results are on the page and the page number', async () => {
    const {byTestId} = await render(params(1))
    expect(byTestId('paginator-range').textContent?.trim()).toBe('Showing 11–20 of 45')
    expect(byTestId('paginator-current').textContent?.trim()).toBe('2 / 5')
  })

  it('ends the range at the last result on the last page, also with the page size as a string', async () => {
    const {byTestId} = await render(params(1, {pageSize: '25' as unknown as number, totalPages: 2, hasNext: false}))
    expect(byTestId('paginator-range').textContent?.trim()).toBe('Showing 26–45 of 45')
  })

  it('disables first and previous on the first page, next and last on the last', async () => {
    const first = await render(params(0))
    expect(first.byTestId('paginator-first').disabled).toBe(true)
    expect(first.byTestId('paginator-previous').disabled).toBe(true)
    expect(first.byTestId('paginator-next').disabled).toBe(false)
  })

  it('asks for the first, previous, next and last page', async () => {
    const {byTestId, pages} = await render(params(2))
    for (const id of ['paginator-first', 'paginator-previous', 'paginator-next', 'paginator-last']) {
      byTestId(id).click()
    }
    expect(pages).toEqual([0, 1, 3, 4])
  })

  it('stays hidden without results', async () => {
    const {byTestId} = await render(params(0, {totalElements: 0, totalPages: 0}))
    expect(byTestId('paginator')).toBeNull()
  })
})
