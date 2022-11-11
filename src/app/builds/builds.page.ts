import {ChangeDetectionStrategy, Component} from "@angular/core";
import {select, Store} from "@ngrx/store";
import {Buildz, IBuildSearchParams} from "../core/state/model";
import {availableSearchData, theBuilds, theBuildSearchParams, theBuildSearchResult} from "./state/builds.selectors";
import {resetSearchParams, updateSearchParams} from "./state/builds.actions";

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
      <div class="row">
        <div class="col">
        </div>
      </div>
      <div class="row mt-5">
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

  updateSearch(search: IBuildSearchParams): void {
    this.store.dispatch(updateSearchParams({search}))
  }

  resetSearch(): void {
    this.store.dispatch(resetSearchParams())
  }

  constructor(private store: Store<Buildz>) {
  }
}
