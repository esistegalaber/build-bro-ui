import {ChangeDetectionStrategy, Component} from "@angular/core";
import {select, Store} from "@ngrx/store";
import {Buildz, IBuildSearchParams} from "../core";
import {resetSearchParams, toSearchPage, updateSearchParams} from "./state/builds.actions";
import {searchData, theBuilds, theBuildSearchPaginationParams, theBuildSearchParams} from "./state/builds.selectors";
import {CommonModule} from "@angular/common";
import {BuildSearchForm} from "../ui/builds/build-search.form";
import {BuildsAccordion} from "../ui/builds/builds.accordion";
import {Paginator} from "../ui/paginator";
import {CoreModule} from "../core/core.module";

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
        </bz-build-search-form>
      </div>
      <div class="mx-auto">
        <bb-paginator
          [maxSize]="10" [paginationParams]="(thePaginationParams$|async)!"
          (toPage)="toPage($event)"
        ></bb-paginator>
      </div>
      <bb-builds-accordion
        [builds]="(theBuilds$ | async)!"
      ></bb-builds-accordion>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    CoreModule,
    BuildSearchForm,
    BuildsAccordion,
    Paginator
  ]
})
export class BuildsPage {
  availableSearchData$ = this.store.pipe(select(searchData))
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
