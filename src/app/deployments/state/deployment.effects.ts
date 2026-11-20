import {Injectable, inject} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import * as DeploymentActions from "./deployment.actions";
import {catchError, exhaustMap, map, withLatestFrom} from "rxjs/operators";
import {select, Store} from "@ngrx/store";
import {Buildz, IDeploymentSearch, IDeploymentSearchResult} from "../../core";
import {theDeploymentSearch} from "./deployment.selectors";
import {of} from "rxjs";
import * as CoreActions from "../../core/actions";
import {HttpClient} from "@angular/common/http";


@Injectable()
export class DeploymentEffects {
  private actions$ = inject(Actions);
  private store = inject<Store<Buildz>>(Store);
  private http = inject(HttpClient);

  deploymentSearch$ = createEffect(() => this.actions$.pipe(
    ofType(DeploymentActions.doDeploymentsSearch, DeploymentActions.updateDeploymentsSearch, DeploymentActions.toSearchPage),
    withLatestFrom(this.store.pipe(select(theDeploymentSearch))),
    map(([action, search]) => search),
    exhaustMap((search: IDeploymentSearch) => this.http.post<IDeploymentSearchResult>(`/api/v1/deployments/search`, search).pipe(
        map((result: IDeploymentSearchResult) => DeploymentActions.deploymentsSearchLoaded({result})),
        catchError(errorResponse => of(CoreActions.backendErrorOccurred({errorResponse})))
      )
    )
  ))
}
