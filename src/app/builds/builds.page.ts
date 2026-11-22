import {ChangeDetectionStrategy, Component, inject} from "@angular/core";
import {select, Store} from "@ngrx/store";
import {Buildz, IBuildSearchParams} from "../core";
import * as SearchActions from "./state/builds.actions";
import {searchData, theBuilds, theBuildSearchPaginationParams, theBuildSearchParams} from "./state/builds.selectors";
import {CommonModule} from "@angular/common";
import {BuildSearchForm} from "./ui/build-search.form";
import {BuildsAccordion} from "../ui/builds/builds.accordion";
import {Paginator} from "../ui/paginator";

import {PageHeader} from '../ui/page-header'
import {EmptyState} from '../ui/empty-state'
@Component({
  template: `
    @let pagination = (thePaginationParams$ | async)!;
    @let builds = (theBuilds$ | async)!;
    <div class="flex flex-col gap-6">
      <bb-page-header heading="Builds" description="Every build Build Bruh knows about, newest first."></bb-page-header>

      <bb-build-search-form
        [available]="(availableSearchData$ | async)!"
        [theSearch]="(theSearch$ | async)!"
        (updateSearch)="updateSearch($event)"
        (resetSearch)="resetSearch()"
      ></bb-build-search-form>

      <section class="card bg-base-100 border border-base-300 shadow-sm overflow-hidden" aria-label="Results">
        <div class="flex flex-wrap items-baseline justify-between gap-2 px-5 py-4 border-b border-base-300">
          <h2 class="text-lg font-bold" data-cy-id="builds-count">
            {{ pagination.totalElements ?? 0 }} {{ pagination.totalElements === 1 ? 'build' : 'builds' }}
          </h2>
          <span class="text-sm text-base-content/70">Sorted by build number, newest first</span>
        </div>
        @if (builds?.length) {
          <bb-builds-accordion [builds]="builds"></bb-builds-accordion>
        } @else if (pagination.totalElements === 0) {
          <bb-empty-state icon="search_off" data-cy-id="builds-empty">
            <p>No builds match these filters.</p>
            <button type="button" class="btn btn-sm" (click)="resetSearch()">Reset the filters</button>
          </bb-empty-state>
        }
        @if (pagination.totalElements > 0) {
          <div class="px-5 py-4 border-t border-base-300">
            <bb-paginator [paginationParams]="pagination" (toPage)="toPage($event)"></bb-paginator>
          </div>
        }
      </section>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    BuildSearchForm,
    BuildsAccordion,
    Paginator,
    PageHeader, EmptyState]
})
export class BuildsPage {
  private store = inject<Store<Buildz>>(Store);

  availableSearchData$ = this.store.pipe(select(searchData))
  theSearch$ = this.store.pipe(select(theBuildSearchParams))
  theBuilds$ = this.store.pipe(select(theBuilds))
  thePaginationParams$ = this.store.pipe(select(theBuildSearchPaginationParams))

  updateSearch(search: IBuildSearchParams): void {
    this.store.dispatch(SearchActions.updateSearchParams({search}))
  }

  resetSearch(): void {
    this.store.dispatch(SearchActions.resetSearchParams())
  }

  toPage(page: number): void {
    this.store.dispatch(SearchActions.toSearchPage({page}))
  }

  constructor() {
    this.store.dispatch(SearchActions.doBuildSearch())
  }
}
