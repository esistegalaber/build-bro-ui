import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from "@angular/core";
import {IPaginationParams} from "../../core";

@Component({
  selector: 'bz-paginator',
  template: `
    <div class="d-flex justify-content-center">
      <ngb-pagination [collectionSize]="paginationParams.totalElements"
                      [pageSize]="paginationParams.pageSize"
                      [maxSize]="maxSize"
                      [(page)]="paginationParams.currentPage"
                      size="sm"
                      (pageChange)="toPage.emit($event)"
      >
      </ngb-pagination>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaginationPanel {
  @Input()
  paginationParams!: IPaginationParams
  @Input()
  maxSize!: number
  @Output()
  toPage = new EventEmitter<number>()
}
