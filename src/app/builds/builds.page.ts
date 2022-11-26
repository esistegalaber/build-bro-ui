import {ChangeDetectionStrategy, Component} from "@angular/core";
import {select, Store} from "@ngrx/store";
import {Buildz, IBuildSearchParams} from "../core";
import {availableSearchData, theBuilds, theBuildsAsTreeData, theBuildSearchPaginationParams, theBuildSearchParams} from "./state/builds.selectors";
import {resetSearchParams, toSearchPage, updateSearchParams} from "./state/builds.actions";
import {pipe} from "rxjs";

@Component({
  template: `
    <h2>Builds</h2>
    <div class="grid grid-cols-1 gap-4">
      <div class="px-5">
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
      <bz-paginator
        [maxSize]="10" [paginationParams]="(thePaginationParams$|async)!"
        (toPage)="toPage($event)"
      ></bz-paginator>
      <!--      <bb-builds-accordion [builds]="(theBuilds$ | async)!"></bb-builds-accordion>-->
      <!--      <bb-build-label-tree *ngFor="let build of theBuilds$ | async" [data]="build"></bb-build-label-tree>-->
      <bb-card title="Search Results">
        <bb-build-data-tree
          [data]="(theBuildsTree$)!"
        ></bb-build-data-tree>
      </bb-card>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BuildsPage {
  availableSearchData$ = this.store.pipe(select(availableSearchData))
  theSearch$ = this.store.pipe(select(theBuildSearchParams))
  theBuilds$ = this.store.pipe(select(theBuilds))
  thePaginationParams$ = this.store.pipe(select(theBuildSearchPaginationParams))
  theBuildsTree$ = this.store.select(pipe(theBuildsAsTreeData))

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
