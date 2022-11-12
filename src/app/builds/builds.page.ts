import {ChangeDetectionStrategy, Component} from "@angular/core";
import {select, Store} from "@ngrx/store";
import {Buildz, IBuildSearchParams} from "../core/state/model";
import {availableSearchData, theBuilds, theBuildSearchPaginationParams, theBuildSearchParams, theBuildSearchResult} from "./state/builds.selectors";
import {resetSearchParams, toSearchPage, updateSearchParams} from "./state/builds.actions";

@Component({
  template: `
    <div class="container-fluid">
      <div class="row">
        <div class="col">
          <bz-build-search-form
            [available]="(availableSearchData$|async)!"
            [theSearch]="(theSearch$|async|deepClone)!"
            (updateSearch)="updateSearch($event)"
            (resetSearch)="resetSearch()"
          >
            <!--            (updateSearchParams)="updateSearchParams($event)"-->
            <!--            (resetSearch)="resetSearch()"-->
            <!--            (addSearchLabel)="openAddLabelDialog()"-->
            <!--            (removeSearchLabel)="removeSearchLabel($event)"-->
          </bz-build-search-form>
        </div>
      </div>
      <div class="row mt-4">
        <div class="col">
          <bz-paginator
            [maxSize]="10" [paginationParams]="(thePaginationParams$|async)!"
            (toPage)="toPage($event)"
          ></bz-paginator>
        </div>
      </div>
      <div class="row mt-2">
        <div class="col">
          <bz-builds-accordion [builds]="(theBuilds$ | async)!"></bz-builds-accordion>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BuildsPage {
  availableSearchData$ = this.store.pipe(select(availableSearchData))
  theSearch$ = this.store.pipe(select(theBuildSearchParams))
  theBuilds$ = this.store.pipe(select(theBuilds))
  thePaginationParams$ = this.store.pipe(select(theBuildSearchPaginationParams))

  updateSearch(search: IBuildSearchParams): void {
    this.store.dispatch(updateSearchParams({search}))
  }

  resetSearch(): void {
    this.store.dispatch(resetSearchParams())
  }

  toPage(page: number): void {
    this.store.dispatch(toSearchPage({page}))
  }

  constructor(private store: Store<Buildz>) {
  }
}
