import {ChangeDetectionStrategy, Component, DestroyRef, EventEmitter, inject, Input, Output} from '@angular/core'
import {IBuildSearchParams, IBuildSearchResult, ISearchData} from "../../core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";

/** How long the build number fields wait after the last keystroke before they search. */
export const TYPING_PAUSE_MS = 300

@Component({
  selector: 'bb-build-search-form',
  template: `
    <form novalidate (submit)="search()" #searchForm="ngForm" aria-label="Filters"
          class="card bg-base-100 border border-base-300 shadow-sm">
      <div class="card-body gap-4 p-5">
        <div class="grid grid-cols-[repeat(auto-fit,minmax(10rem,1fr))] items-end gap-3">
          <label class="flex flex-col gap-1 text-xs font-semibold text-base-content/70">Project
            <select class="select select-sm w-full" name="project" data-cy-id="project-select"
                    [(ngModel)]="theSearch.project" (ngModelChange)="search()">
              <option value="">All projects</option>
              @for (project of available.projectNames; track project) {
                <option [value]="project">{{ project }}</option>
              }
            </select>
          </label>
          <label class="flex flex-col gap-1 text-xs font-semibold text-base-content/70">Branch
            <select class="select select-sm w-full" name="branch" data-cy-id="branch-select"
                    [(ngModel)]="theSearch.branch" (ngModelChange)="search()">
              <option value="">All branches</option>
              @for (branch of available.projectBranches[theSearch.project]; track branch) {
                <option [value]="branch">{{ branch }}</option>
              }
            </select>
          </label>
          <label class="flex flex-col gap-1 text-xs font-semibold text-base-content/70">Build number from
            <input type="text" inputmode="numeric" placeholder="min" class="input input-sm w-full" name="minBuildNumber"
                   data-cy-id="min-build-number-input" [(ngModel)]="theSearch.minBuildNumber" (ngModelChange)="searchAfterTyping()"/>
          </label>
          <label class="flex flex-col gap-1 text-xs font-semibold text-base-content/70">to
            <input type="text" inputmode="numeric" placeholder="max" class="input input-sm w-full" name="maxBuildNumber"
                   data-cy-id="max-build-number-input" [(ngModel)]="theSearch.maxBuildNumber" (ngModelChange)="searchAfterTyping()"/>
          </label>
          <label class="flex flex-col gap-1 text-xs font-semibold text-base-content/70">Per page
            <select class="select select-sm w-full" name="pageSize" data-cy-id="page-size-select"
                    [(ngModel)]="theSearch.pageSize" (ngModelChange)="search()">
              <option [value]="10">10</option>
              <option [value]="25">25</option>
              <option [value]="50">50</option>
            </select>
          </label>
        </div>

        <div class="flex flex-wrap items-end gap-3">
          <label class="flex grow basis-40 flex-col gap-1 text-xs font-semibold text-base-content/70">Label
            <input class="input input-sm w-full" type="text" placeholder="key, e.g. integration-test" name="newLabelKey"
                   data-cy-id="label-key-input" [(ngModel)]="newLabelKey">
          </label>
          <label class="flex grow basis-40 flex-col gap-1 text-xs font-semibold text-base-content/70">Value
            <input class="input input-sm w-full" type="text" placeholder="value" name="newLabelVal"
                   data-cy-id="label-value-input" [(ngModel)]="newLabelVal">
          </label>
          <button type="button" class="btn btn-sm btn-soft btn-primary" [disabled]="!canAddLabel" (click)="addSearchLabel()"
                  data-cy-id="label-add">
            <span class="material-icons text-[18px]" aria-hidden="true">add</span>Add label
          </button>
          <div class="ms-auto flex gap-2">
            <button type="button" class="btn btn-sm btn-ghost" (click)="reset()" data-cy-id="search-reset">
              <span class="material-icons text-[18px]" aria-hidden="true">restart_alt</span>Reset
            </button>
            <button type="submit" class="btn btn-sm btn-primary" data-cy-id="search-reload">
              <span class="material-icons text-[18px]" aria-hidden="true">refresh</span>Reload
            </button>
          </div>
        </div>

        @if (hasLabels) {
          <div class="flex flex-wrap items-center gap-2">
            <span class="text-xs font-semibold text-base-content/70">Label filters</span>
            @for (label of theSearch.labels | keyvalue; track label.key) {
              <span class="badge badge-soft badge-primary h-auto gap-1 py-1 ps-3 pe-1" data-cy-id="search-label">
                <span>{{ label.key }} = {{ label.value }}</span>
                <button type="button" class="btn btn-ghost btn-xs btn-circle" (click)="removeSearchLabel(label.key)"
                        [attr.aria-label]="'Remove the label filter ' + label.key" data-cy-id="search-label-remove">
                  <span class="material-icons text-[16px]" aria-hidden="true">close</span>
                </button>
              </span>
            }
          </div>
        }
      </div>
    </form>
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

  /** the search waiting for typing to pause, if any */
  private pendingSearch: ReturnType<typeof setTimeout> | undefined

  constructor() {
    inject(DestroyRef).onDestroy(() => this.cancelPendingSearch())
  }

  /** Searches right away (selects, Enter, Reload, labels); a search still waiting for typing to pause is dropped. */
  search(): void {
    this.cancelPendingSearch()
    this.updateSearch.emit(this.theSearch)
  }

  /** Searches once typing has paused, so a number typed quickly starts one search, not one per keystroke. */
  searchAfterTyping(): void {
    this.cancelPendingSearch()
    this.pendingSearch = setTimeout(() => this.search(), TYPING_PAUSE_MS)
  }

  reset(): void {
    this.cancelPendingSearch()
    this.resetSearch.emit()
  }

  private cancelPendingSearch(): void {
    clearTimeout(this.pendingSearch)
    this.pendingSearch = undefined
  }

  /** A label filter needs both a key and a value. */
  get canAddLabel(): boolean {
    return this.newLabelKey.trim().length > 0 && this.newLabelVal.trim().length > 0
  }

  get hasLabels(): boolean {
    return Object.keys(this.theSearch.labels ?? {}).length > 0
  }

  addSearchLabel() {
    this.theSearch.labels[this.newLabelKey.trim()] = this.newLabelVal.trim();
    this.newLabelKey = ''
    this.newLabelVal = ''
    this.search()
  }

  removeSearchLabel(key: string) {
    delete this.theSearch.labels[key]
    this.search()
  }
}
