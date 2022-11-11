import {Component, EventEmitter, Input, Output} from '@angular/core'
import {IBuildLabel, IBuildSearchParams, IBuildSearchResult, ISearchData} from "../../core";

@Component({
  selector: 'bz-build-search-form',
  template: `
    <div class="container-fluid">
      <form novalidate (submit)="updateSearch.emit(theSearch)">
        <div class="row">
          <div class="col">
            <div class="form-group">
              <select class="form-control form-control-sm" [(ngModel)]="theSearch.project" name="project" (change)="updateSearch.emit(theSearch)">
                <option value="">All Projects</option>
                <option *ngFor="let name of available.projectNames" [value]="name">{{name}}</option>
              </select>
            </div>
          </div>
          <div class="col">
            <div class="form-group">
              <select class="form-control form-control-sm" [(ngModel)]="theSearch.branch" name="branch" (ngModelChange)="updateSearch.emit(theSearch)">
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
            <button class="btn btn-sm btn-secondary mx-2" (click)="addSearchLabel.emit()">
              <fa-icon icon="plus"></fa-icon>
              Add Label
            </button>
          </div>
          <div class="col">
            <button class="btn btn-sm btn-secondary mx-2" (click)="resetSearch.emit()">
              <fa-icon icon="undo"></fa-icon>
              Reset
            </button>
          </div>
          <div class="col">
            <button class="btn btn-sm btn-secondary mx-2" (click)="updateSearch.emit(theSearch)">
              <fa-icon icon="sync"></fa-icon>
              Reload
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

          <!--          <div class="col-4">-->
          <!--            <button class="btn btn-sm btn-danger" (click)="removeSearchLabel.emit({key:label.key, value:label.value})">-->
          <!--              <fa-icon icon="backspace"></fa-icon>-->
          <!--            </button>-->
          <!--          </div>-->
        </div>
      </form>
    </div>
  `
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

  labelsPresent(): boolean {
    return (this.theSearch && this.theSearch.labels && (Object.keys(this.theSearch.labels).length > 0))
  }

  toPage(page: number): void {
    this.theSearch.page = (page - 1)
    this.updateSearch.emit(this.theSearch)
  }

  constructor() {
  }
}
