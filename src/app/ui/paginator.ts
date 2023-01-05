import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from "@angular/core";
import {IPaginationParams} from "../core";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'bb-paginator',
  template: `
    <ng-container *ngIf="paginationParams.totalElements>0">
      <div class="btn-group" data-cy-id="paginator">
        <button class="btn btn-sm" [ngClass]="{'btn-disabled':!paginationParams.hasPrevious}" (click)="toPage.emit(0)"
                data-cy-id="paginator-first">
          <span class="material-icons">fast_rewind</span>
        </button>
        <button class="btn btn-sm" [class.btn-disabled]="!paginationParams.hasPrevious" (click)="toPage.emit(paginationParams.currentPage-1)"
                data-cy-id="paginator-previous">
          <span class="material-icons">arrow_back_ios</span>
        </button>
        <button class="btn btn-sm btn-active">{{paginationParams.currentPage + 1}} / {{paginationParams.totalPages}}</button>
        <button class="btn btn-sm" [class.btn-disabled]="!paginationParams.hasNext" (click)="toPage.emit(paginationParams.currentPage+1)"
                data-cy-id="paginator-next">
          <span class="material-icons">arrow_forward_ios</span>
        </button>
        <button class="btn btn-sm" [class.btn-disabled]="!paginationParams.hasNext" (click)="toPage.emit(paginationParams.totalPages-1)"
                data-cy-id="paginator-last">
          <span class="material-icons">fast_forward</span>
        </button>
      </div>
    </ng-container>
  `,
  standalone: true,
  imports: [
    CommonModule
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
