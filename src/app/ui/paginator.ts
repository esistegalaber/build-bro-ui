import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core'
import {IPaginationParams} from '../core'

/** "Showing x–y of n" and first / previous / current / next / last buttons. Hidden when there are no results. */
@Component({
  selector: 'bb-paginator',
  template: `
    @if (paginationParams && paginationParams.totalElements > 0) {
      <div class="flex flex-wrap items-center justify-between gap-3" data-cy-id="paginator">
        <span class="text-sm text-base-content/70" data-cy-id="paginator-range">
          Showing {{ from }}–{{ to }} of {{ paginationParams.totalElements }}
        </span>
        <nav class="join" aria-label="Pages">
          <button type="button" class="join-item btn btn-sm btn-square" [disabled]="!paginationParams.hasPrevious"
                  (click)="toPage.emit(0)" aria-label="First page" data-cy-id="paginator-first">
            <span class="material-icons" aria-hidden="true">first_page</span>
          </button>
          <button type="button" class="join-item btn btn-sm btn-square" [disabled]="!paginationParams.hasPrevious"
                  (click)="toPage.emit(paginationParams.currentPage - 1)" aria-label="Previous page" data-cy-id="paginator-previous">
            <span class="material-icons" aria-hidden="true">chevron_left</span>
          </button>
          <span class="join-item btn btn-sm pointer-events-none font-mono" aria-current="page" data-cy-id="paginator-current">
            {{ paginationParams.currentPage + 1 }} / {{ paginationParams.totalPages }}
          </span>
          <button type="button" class="join-item btn btn-sm btn-square" [disabled]="!paginationParams.hasNext"
                  (click)="toPage.emit(paginationParams.currentPage + 1)" aria-label="Next page" data-cy-id="paginator-next">
            <span class="material-icons" aria-hidden="true">chevron_right</span>
          </button>
          <button type="button" class="join-item btn btn-sm btn-square" [disabled]="!paginationParams.hasNext"
                  (click)="toPage.emit(paginationParams.totalPages - 1)" aria-label="Last page" data-cy-id="paginator-last">
            <span class="material-icons" aria-hidden="true">last_page</span>
          </button>
        </nav>
      </div>
    }
  `,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Paginator {
  @Input()
  paginationParams!: IPaginationParams
  @Output()
  toPage = new EventEmitter<number>()

  /** The number of the first result on this page (the page size can arrive as a string from a select). */
  get from(): number {
    return this.paginationParams.currentPage * Number(this.paginationParams.pageSize) + 1
  }

  get to(): number {
    return Math.min((this.paginationParams.currentPage + 1) * Number(this.paginationParams.pageSize), this.paginationParams.totalElements)
  }
}
