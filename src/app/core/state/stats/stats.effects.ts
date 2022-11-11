import {Injectable} from '@angular/core'
import {Actions, createEffect, ofType} from '@ngrx/effects'
import {catchError, map, switchMap} from 'rxjs/operators'
import {IBuildStats} from '../model'
import * as StatsActions from './stats.state'
import {HttpClient} from '@angular/common/http'
import {of} from 'rxjs'
import * as AlertActions from '../alerts/alert.actions'

@Injectable()
export class StatsEffects {
  loadBuildStats$ = createEffect(() => this.actions$.pipe(
    ofType(StatsActions.loadBuildStats),
    switchMap(() => this.http.get<IBuildStats>(`/api/v1/stats`).pipe(
      map((stats: IBuildStats) => StatsActions.buildStatsLoaded({stats})),
      catchError(errorResponse => of(AlertActions.backendErrorOccurred({errorResponse})))
    ))
  ))


  constructor(private actions$: Actions, private http: HttpClient) {
  }
}
