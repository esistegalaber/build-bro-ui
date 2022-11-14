import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from "@angular/core";
import {IPaginationParams} from "../../core";

@Component({
  selector: 'bz-paginator',
  template: `
    <div class="row" *ngIf="paginationParams.totalElements > 0">
      <div class="col d-flex justify-content-center">
        <ngb-pagination [collectionSize]="paginationParams.totalElements"
                        [pageSize]="paginationParams.pageSize"
                        [maxSize]="maxSize"
                        [(page)]="paginationParams.currentPage"
                        size="sm"
                        (pageChange)="toPage.emit($event)"
                        data-cy-id="paginator"
        >
        </ngb-pagination>
      </div>
    </div>
    <!--    <div class="d-flex justify-content-center">-->
    <!--    </div>-->
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
