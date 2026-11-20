import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core'
import {IBuildSearchParams, IBuildSearchResult, ISearchData} from "../../core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'bb-build-search-form',
  template: `
      <div class="container p-1">
        <form novalidate (submit)="updateSearch.emit(theSearch)" #searchForm="ngForm">
          <div class="grid grid-cols-12 gap-2">
            <select class="select select-bordered select-sm w-full max-w-xs col-span-4"
              data-cy-id="project-select"
              name="project"
              [(ngModel)]="theSearch.project"
              (ngModelChange)="updateSearch.emit(theSearch)"
              >
              <option value="">All</option>
              @for (project of available.projectNames; track project) {
                <option [value]="project">{{project}}</option>
              }
            </select>
      
            <input type="text" placeholder="Min BuildNumber" class="input input-bordered input-sm w-full max-w-xs col-span-2"
              name="minBuildNumber" data-cy-id="min-build-number-input"
              [(ngModel)]="theSearch.minBuildNumber"
              (keyup)="updateSearch.emit(theSearch)"/>
      
            <div class="col-span-6">
              <div class="flex justify-around">
                <button type="button" class="btn btn-sm btn-accent" (click)="resetSearch.emit()" data-cy-id="search-reset">
                  <span class="material-icons">restart_alt</span>
                  Reset
                </button>
      
                <select class="select select-bordered select-sm"
                  name="pageSize"
                  [(ngModel)]="theSearch.pageSize"
                  (ngModelChange)="updateSearch.emit(theSearch)"
                  >
                  <option [value]="10">10 / Page</option>
                  <option [value]="25">25 / Page</option>
                  <option [value]="50">50 / Page</option>
                </select>
                <button type="submit" class="btn btn-sm btn-primary" data-cy-id="search-reload">
                  <span class="material-icons">search</span>
                  (Re-)Load
                </button>
      
              </div>
            </div>
      
            <select class="select select-bordered select-sm w-full max-w-xs col-span-4"
              data-cy-id="branch-select"
              name="branch"
              [(ngModel)]="theSearch.branch"
              (ngModelChange)="updateSearch.emit(theSearch)"
              >
              <option value="">All</option>
              @for (branch of available.projectBranches[theSearch.project]; track branch) {
                <option [value]="branch">{{branch}}</option>
              }
            </select>
      
            <input type="text" placeholder="Max BuildNumber" class="input input-bordered input-sm w-full max-w-xs col-span-2"
              name="maxBuildNumber"
              [(ngModel)]="theSearch.maxBuildNumber"
              (keyup)="updateSearch.emit(theSearch)"/>
            <div class="col-span-6">
              <div class="grid grid-cols-12">
                <div class="col-span-4">
                  <input class="input input-bordered input-sm" type="text" placeholder="Key" name="newLabelKey" data-cy-id="label-key-input"
                    [(ngModel)]="newLabelKey"
                    >
                </div>
                <div class="col-span-4">
                  <input class="input input-bordered input-sm" type="text" placeholder="Value" name="newLabelVal" data-cy-id="label-value-input"
                    [(ngModel)]="newLabelVal">
                </div>
                <div class="col-span-4">
                  <button type="button" [disabled]="newLabelVal.length==0 || newLabelVal.length==0 " class="btn btn-sm" (click)="addSearchLabel()" data-cy-id="label-add">
                    <span class="material-icons">add</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
        @for (label of theSearch.labels | keyvalue; track label.key) {
          <div class="grid grid-cols-12 gap-2" data-cy-id="search-label">
            <input type="text" value="{{label.key}}" class="input-bordered input input-sm col-span-5" readonly>
            <input type="text" value="{{label.value}}" class="input-bordered input input-sm col-span-5" readonly>
            <button class="btn btn-sm btn-secondary" (click)="removeSearchLabel(label.key)" data-cy-id="search-label-remove">
              <span class="material-icons">remove</span>
            </button>
          </div>
        }
      </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  updateSearch = new EventEmitter<IBuildSearchParams>()

  newLabelKey = '';
  newLabelVal = '';

  addSearchLabel() {
    this.theSearch.labels[this.newLabelKey] = this.newLabelVal;
    this.newLabelKey = ''
    this.newLabelVal = ''
    this.updateSearch.emit(this.theSearch)
  }

  removeSearchLabel(key: string) {
    delete this.theSearch.labels[key]
    this.updateSearch.emit(this.theSearch)
  }
}
