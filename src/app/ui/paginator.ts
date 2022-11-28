import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from "@angular/core";
import {IPaginationParams} from "../core";
import {CommonModule} from "@angular/common";
import {MatPaginatorModule} from "@angular/material/paginator";

@Component({
  selector: 'bz-paginator',
  template: `
    <mat-paginator
      [pageSize]="paginationParams.pageSize"
      [length]="paginationParams.totalElements"
      (page)="toPage.emit($event.pageIndex)"
      showFirstLastButtons="true"
      hidePageSize="true"
    ></mat-paginator>
    <!--    <div class="row" *ngIf="paginationParams.totalElements > 0">-->
    <!--      <div class="col d-flex justify-content-center">-->
    <!--        &lt;!&ndash;        <ngb-pagination [collectionSize]="paginationParams.totalElements"&ndash;&gt;-->
    <!--        &lt;!&ndash;                        [pageSize]="paginationParams.pageSize"&ndash;&gt;-->
    <!--        &lt;!&ndash;                        [maxSize]="maxSize"&ndash;&gt;-->
    <!--        &lt;!&ndash;                        [(page)]="paginationParams.currentPage"&ndash;&gt;-->
    <!--        &lt;!&ndash;                        size="sm"&ndash;&gt;-->
    <!--        &lt;!&ndash;                        (pageChange)="toPage.emit($event)"&ndash;&gt;-->
    <!--        &lt;!&ndash;                        data-cy-id="paginator"&ndash;&gt;-->
    <!--        &lt;!&ndash;        >&ndash;&gt;-->
    <!--        &lt;!&ndash;        </ngb-pagination>&ndash;&gt;-->
    <!--      </div>-->
    <!--    </div>-->
    <!--    <div class="d-flex justify-content-center">-->
    <!--    </div>-->
  `,
  standalone: true,
  imports: [
    CommonModule, MatPaginatorModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Paginator {
  @Input()
  paginationParams!: IPaginationParams
  @Input()
  maxSize!: number
  @Output()
  toPage = new EventEmitter<number>()
}
