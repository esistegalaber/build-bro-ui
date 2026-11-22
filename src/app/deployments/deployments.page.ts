import {ChangeDetectionStrategy, Component, inject} from "@angular/core";
import {CommonModule} from "@angular/common";
import {select, Store} from "@ngrx/store";
import {Buildz, CloningPipe, IDeployment, IDeploymentSearch} from "../core";
import * as DeploymentActions from "./state/deployment.actions";
import {theDeployments, theDeploymentSearch, theDeploymentSearchPaginationParams} from "./state/deployment.selectors";
import {allServers} from "../core/state/servers/server.selectors";
import {DeploymentsSearchForm} from "./ui/deployments-search.form";
import {Observable} from "rxjs";
import {Paginator} from "../ui/paginator";
import {DeploymentList} from "../ui/deployments/deployment.list";

@Component({
  template: `
    @let pagination = (thePaginationParams$ | async)!;
    @let deployments = (theDeployments$ | async)!;
    <div class="flex flex-col gap-6">
      <header class="flex flex-col gap-1">
        <h1 class="text-3xl font-extrabold tracking-tight">Deployments</h1>
        <p class="text-base-content/70">What was deployed where, newest first.</p>
      </header>

      <bb-deployments-search-form
        [servers]="(servers$ | async)!"
        [theSearch]="(theDeploymentsSearch$ | async | deepClone)!"
        (updateSearch)="updateDeploymentsSearch($event)"
        (resetSearch)="resetDeploymentsSearch()"
      ></bb-deployments-search-form>

      <section class="card bg-base-100 border border-base-300 shadow-sm overflow-hidden" aria-label="Results">
        <div class="flex flex-wrap items-baseline justify-between gap-2 px-5 py-4 border-b border-base-300">
          <h2 class="text-lg font-bold" data-cy-id="deployments-count">
            {{ pagination.totalElements ?? 0 }} {{ pagination.totalElements === 1 ? 'deployment' : 'deployments' }}
          </h2>
          <span class="text-sm text-base-content/70">Newest first</span>
        </div>
        @if (deployments?.length) {
          <bb-deployment-list [deployments]="deployments" [servers]="(servers$ | async) ?? []"></bb-deployment-list>
        } @else if (pagination.totalElements === 0) {
          <div class="flex flex-col items-center gap-3 px-5 py-10 text-center text-base-content/70" data-cy-id="deployments-empty">
            <span class="material-icons text-4xl!" aria-hidden="true">rocket_launch</span>
            <p>No deployments match these filters.</p>
            <button type="button" class="btn btn-sm" (click)="resetDeploymentsSearch()">Reset the filters</button>
          </div>
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
    DeploymentsSearchForm,
    CloningPipe,
    Paginator,
    DeploymentList
  ]
})
export class DeploymentsPage {
  private store = inject<Store<Buildz>>(Store);

  servers$ = this.store.pipe(select(allServers))
  theDeploymentsSearch$ = this.store.pipe(select(theDeploymentSearch))
  thePaginationParams$ = this.store.pipe(select(theDeploymentSearchPaginationParams))

  theDeployments$: Observable<IDeployment[]> = this.store.pipe(select(theDeployments))

  updateDeploymentsSearch(search: IDeploymentSearch): void {
    this.store.dispatch(DeploymentActions.updateDeploymentsSearch({search}))
  }

  resetDeploymentsSearch(): void {
    this.store.dispatch(DeploymentActions.resetDeploymentsSearch())
  }

  toPage(page: number): void {
    this.store.dispatch(DeploymentActions.toSearchPage({page}))
  }

  constructor() {
    this.store.dispatch(DeploymentActions.doDeploymentsSearch())
  }

}
