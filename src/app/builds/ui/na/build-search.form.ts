import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core'
import {IBuildLabel, IBuildSearchParams, IBuildSearchResult, ISearchData} from "../../../core";

@Component({
  selector: 'bz-build-search-form',
  template: `
    <div class="container-fluid">
      <form novalidate (submit)="updateSearch.emit(theSearch)">
        <div class="row">
          <mat-form-field class=" col-4">
            <mat-label>Projects</mat-label>
            <mat-select [(value)]="theSearch.project" data-cy-id="project-select" (selectionChange)="updateSearch.emit(theSearch)">
              <mat-option [value]="">All</mat-option>
              <mat-option *ngFor="let project of available.projectNames" [value]="project">{{project}}</mat-option>
            </mat-select>
          </mat-form-field>
          <mat-form-field class="col-4">
            <mat-label>Branches</mat-label>
            <mat-select [(value)]="theSearch.branch" data-cy-id="branch-select" (selectionChange)="updateSearch.emit(theSearch)">
              <mat-option [value]="">All</mat-option>
              <mat-option *ngFor="let branch of available.projectBranches[theSearch.project]" [value]="branch">{{branch}}</mat-option>
            </mat-select>
          </mat-form-field>
          <mat-form-field class="col-2">
            <mat-label>PageSize</mat-label>
            <mat-select [(value)]="theSearch.pageSize" data-cy-id="pagesize-select" (selectionChange)="updateSearch.emit(theSearch)">
              <mat-option [value]="10">10 / Page</mat-option>
              <mat-option [value]="25">25 / Page</mat-option>
              <mat-option [value]="50">50 / Page</mat-option>
            </mat-select>
          </mat-form-field>
        </div>
        <div class="row mt-1">
          <mat-form-field class="col">
            <mat-label>Min BuildNumber</mat-label>
            <input matInput type="number" placeholder="Min BuildNumber"
                   name="minBuildNumber"
                   [(ngModel)]="theSearch.minBuildNumber"
                   (keyup)="updateSearch.emit(theSearch)">
          </mat-form-field>
          <mat-form-field class="col">
            <mat-label>Max BuildNumber</mat-label>
            <input matInput type="number" placeholder="Min BuildNumber"
                   name="maxBuildNumber"
                   [(ngModel)]="theSearch.maxBuildNumber"
                   (keyup)="updateSearch.emit(theSearch)">
          </mat-form-field>
          <div class="col">
          </div>
          <div class="col">
            <button mat-raised-button color="accent" (click)="resetSearch.emit()">
              <mat-icon>restart_alt</mat-icon> Reset
            </button>
          </div>
          <div class="col">
            <button mat-raised-button color="primary" (click)="updateSearch.emit(theSearch)" css="btn-sm btn-secondary">
              <mat-icon>search</mat-icon> (Re-)Load
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
}
