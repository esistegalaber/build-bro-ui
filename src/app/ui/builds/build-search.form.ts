import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core'
import {IBuildLabel, IBuildSearchParams, IBuildSearchResult, ISearchData} from "../../core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'bz-build-search-form',
  template: `
    <div class="container p-1">
      <form novalidate (submit)="updateSearch.emit(theSearch)">
        <div class="grid grid-cols-3 gap-4">

          <select class="select select-bordered select-sm w-full max-w-xs"
                  name="project"
                  [(ngModel)]="theSearch.project"
                  (ngModelChange)="updateSearch.emit(theSearch)"
          >
            <option value="">All</option>
            <option *ngFor="let project of available.projectNames" [value]="project">{{project}}</option>
          </select>

          <select class="select select-bordered select-sm w-full max-w-xs"
                  name="branch"
                  [(ngModel)]="theSearch.branch"
                  (ngModelChange)="updateSearch.emit(theSearch)"
          >
            <option value="">All</option>
            <option *ngFor="let branch of available.projectBranches[theSearch.project]" [value]="branch">{{branch}}</option>
          </select>

          <select class="select select-bordered select-sm w-full max-w-xs"
                  name="pageSize"
                  [(ngModel)]="theSearch.pageSize"
                  (ngModelChange)="updateSearch.emit(theSearch)"
          >
            <option [value]="10">10 / Page</option>
            <option [value]="25">25 / Page</option>
            <option [value]="50">50 / Page</option>
          </select>

          <input type="text" placeholder="Min BuildNumber" class="input input-bordered input-sm w-full max-w-xs"
                 name="minBuildNumber"
                 [(ngModel)]="theSearch.minBuildNumber"
                 (keyup)="updateSearch.emit(theSearch)"/>

          <input type="text" placeholder="Max BuildNumber" class="input input-bordered input-sm w-full max-w-xs"
                 name="maxBuildNumber"
                 [(ngModel)]="theSearch.maxBuildNumber"
                 (keyup)="updateSearch.emit(theSearch)"/>

          <div class="grid grid-cols-2 gap-4">
            <button class="btn btn-sm btn-accent" (click)="resetSearch.emit()">
              <span class="material-icons">restart_alt</span>
              Reset
            </button>
            <button class="btn btn-sm btn-primary" (click)="updateSearch.emit(theSearch)" css="btn-sm btn-secondary">
              <span class="material-icons">search</span>
              (Re-)Load
            </button>
          </div>

        </div>

        <div class="form-row" *ngFor="let label of theSearch.labels | keyvalue">

          <div class="col-4">
            <div class="form-group">
              <input type="text" class="form-control form-control-sm"
                     [value]="label.key" readonly>
            </div>
          </div>

          <div class="col-4">
            <div class="form-group">
              <input type="text" class="form-control form-control-sm"
                     [value]="label.value" readonly>
            </div>
          </div>
        </div>
      </form>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule, FormsModule
  ]
})
export class BuildSearchForm {
  @Input()
  available!: ISearchData
  @Input()
  theSearch!: IBuildSearchParams
  @Input()
  theSearchResult!: IBuildSearchResult
  @Output()
  resetSearch = new EventEmitter<void>()
  @Output()
  addSearchLabel = new EventEmitter<void>()
  @Output()
  removeSearchLabel = new EventEmitter<IBuildLabel>()
  @Output()
  updateSearch = new EventEmitter<IBuildSearchParams>()
}
