import {ChangeDetectionStrategy, Component} from "@angular/core";
import {CommonModule} from "@angular/common";
import {select, Store} from "@ngrx/store";
import {Buildz, CloningPipe, IDeployment, IDeploymentSearch} from "../core";
import * as DeploymentActions from "./state/deployment.actions";
import {theDeployments, theDeploymentSearch, theDeploymentSearchPaginationParams} from "./state/deployment.selectors";
import {allServers} from "../core/state/servers/server.selectors";
import {DeploymentsSearchForm} from "./ui/deployments-search.form";
import {Observable} from "rxjs";
import {Paginator} from "../ui/paginator";
import {BuildSetAccordion} from "../ui/deployments/depoyment.accordion";

@Component({
  template: `
    <div class="grid grid-cols-1 gap-4">
      <bb-deployments-search-form
        [servers]="(servers$ | async)!"
        [theSearch]="(theDeploymentsSearch$ | async | deepClone)!"
        (updateSearch)="updateDeploymentsSearch($event)"
      >
      </bb-deployments-search-form>
      <div class="mx-auto">
        <bb-paginator
          [maxSize]="10" [paginationParams]="(thePaginationParams$|async)!"
          (toPage)="toPage($event)"
        ></bb-paginator>
      </div>
      <bb-deployment-accordion [deployments]="(theDeployments$ | async)!"></bb-deployment-accordion>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    DeploymentsSearchForm,
    CloningPipe,
    Paginator,
    BuildSetAccordion
  ]
})
export class DeploymentsPage {
  servers$ = this.store.pipe(select(allServers))
  theDeploymentsSearch$ = this.store.pipe(select(theDeploymentSearch))
  thePaginationParams$ = this.store.pipe(select(theDeploymentSearchPaginationParams))

  theDeployments$: Observable<IDeployment[]> = this.store.pipe(select(theDeployments))

  updateDeploymentsSearch(search: IDeploymentSearch): void {
    this.store.dispatch(DeploymentActions.updateDeploymentsSearch({search}))
  }

  toPage(page: number): void {
    this.store.dispatch(DeploymentActions.toSearchPage({page}))
  }

  constructor(private store: Store<Buildz>) {
    this.store.dispatch(DeploymentActions.doDeploymentsSearch())
  }

}
