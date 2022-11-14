import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core'
import {IBuildLabel, IBuildSearchParams, IBuildSearchResult, ISearchData} from "../../core";

@Component({
  selector: 'bz-build-search-form',
  template: `
    <div class="container-fluid">
      <form novalidate (submit)="updateSearch.emit(theSearch)">
        <div class="row">
          <div class="col">
            <div class="form-group">
              <select data-cy-id="project-select"
                      [(ngModel)]="theSearch.project"
                      (change)="updateSearch.emit(theSearch)"
                      name="project"
                      class="form-select form-select-sm"
              >
                <option value="">All Projects</option>
                <option *ngFor="let name of available.projectNames" [value]="name">{{name}}</option>
              </select>
            </div>
          </div>
          <div class="col">
            <div class="form-group">
              <select data-cy-id="branch-select"
                      [(ngModel)]="theSearch.branch"
                      (change)="updateSearch.emit(theSearch)"
                      class="form-select form-select-sm"
                      name="branch"
              >
                <option value="">All Branches</option>
                <option *ngFor="let branch of available.projectBranches[theSearch.project]" [value]="branch">{{branch}}</option>
              </select>
            </div>
          </div>
        </div>
        <div class="row mt-1">
          <div class="col">
            <input type="text" class="form-control form-control-sm" id="minBuildNumber" aria-describedby="minBuildNumberHelp" name="minBuildNumber" placeholder="Min BuildNumber"
                   (keyup)="updateSearch.emit(theSearch)"
                   [(ngModel)]="theSearch.minBuildNumber">
          </div>
          <div class="col">
            <input type="text" class="form-control form-control-sm" id="maxBuildNumber" name="maxBuildNumber" placeholder="Max BuildNumber"
                   (keyup)="updateSearch.emit(theSearch)"
                   [(ngModel)]="theSearch.maxBuildNumber">
          </div>
          <div class="col">
          </div>
          <div class="col">
            <bz-button (click)="resetSearch.emit()" css="btn-sm btn-secondary">
              <fa-icon icon="undo"></fa-icon>
              Reset
            </bz-button>
          </div>
          <div class="col">
            <bz-button (click)="updateSearch.emit(theSearch)" css="btn-sm btn-secondary">
              <fa-icon icon="sync"></fa-icon>
              Reload
            </bz-button>
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
  changeDetection: ChangeDetectionStrategy.OnPush
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

  constructor() {
  }
}
