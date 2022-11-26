import {Injectable} from '@angular/core'
import {Actions, createEffect, ofType} from '@ngrx/effects'
import {HttpClient} from '@angular/common/http'
import {select, Store} from '@ngrx/store'
import {Buildz, IBuildSearchResult, ISearchData} from '../../core'
import {catchError, exhaustMap, map, tap, withLatestFrom} from 'rxjs/operators'
import {of} from 'rxjs'
import * as AlertActions from '../../core/state/alerts/alert.actions'
import {availableBuildSearchDataLoaded, buildSearchLoaded, doBuildSearch, loadAvailableBuildSearchData, toSearchPage, updateSearchParams} from "./builds.actions";
import {theBuildSearchParams} from "./builds.selectors";

@Injectable()
export class BuildsEffects {

  // noinspection JSUnusedLocalSymbols
  doBuildSearch$ = createEffect(() => this.actions$.pipe(
    ofType(doBuildSearch, updateSearchParams, toSearchPage),
    withLatestFrom(this.store.pipe(select(theBuildSearchParams))),
    map(([action, backendSearchParams]) => backendSearchParams),
    exhaustMap((backendSearchParams) => this.http.post<IBuildSearchResult>(`/api/v1/builds/search`, backendSearchParams).pipe(
        map((result: IBuildSearchResult) => buildSearchLoaded({result})),
        catchError(errorResponse => {
          return of(AlertActions.backendErrorOccurred({errorResponse}))
        })
      )
    )
  ))

  loadAvailable$ = createEffect(() => this.actions$.pipe(
    ofType(loadAvailableBuildSearchData),
    exhaustMap(() => this.http.get<ISearchData>(`/api/v1/search-data`).pipe(
        map((available: ISearchData) => availableBuildSearchDataLoaded({available})),
        catchError(errorResponse => {
          return of(AlertActions.backendErrorOccurred({errorResponse}))
        })
      )
    )
  ))


  constructor(private actions$: Actions, private http: HttpClient, private store: Store<Buildz>) {
  }
}

