import {Injectable, inject} from '@angular/core'
import {HttpClient} from '@angular/common/http'
import {Actions, createEffect, ofType} from '@ngrx/effects'
import {of} from 'rxjs'
import {catchError, map, switchMap} from 'rxjs/operators'
import {IBuildSetTemplate, IDeploymentSearch, IDeploymentSearchResult} from '../../core'
import * as CoreActions from '../../core/actions'
import * as HomeActions from './home.actions'

/** The newest deployments of all servers, as many as the home page shows. */
export const RECENT_DEPLOYMENTS_SEARCH: IDeploymentSearch = {
  serverName: '', page: 0, pageSize: 3, sortAttribute: 'deployedAt', sortDirection: 'desc'
}

@Injectable()
export class HomeEffects {
  private actions$ = inject(Actions)
  private http = inject(HttpClient)

  recentDeployments$ = createEffect(() => this.actions$.pipe(
    ofType(HomeActions.loadHome),
    switchMap(() => this.http.post<IDeploymentSearchResult>('/api/v1/deployments/search', RECENT_DEPLOYMENTS_SEARCH).pipe(
      map((result) => HomeActions.recentDeploymentsLoaded({deployments: result.data})),
      catchError((errorResponse) => of(CoreActions.backendErrorOccurred({errorResponse})))
    ))
  ))

  buildSets$ = createEffect(() => this.actions$.pipe(
    ofType(HomeActions.loadHome),
    switchMap(() => this.http.get<IBuildSetTemplate[]>('/api/v1/build-sets').pipe(
      map((templates) => HomeActions.homeBuildSetsLoaded({templates})),
      catchError((errorResponse) => of(CoreActions.backendErrorOccurred({errorResponse})))
    ))
  ))
}
