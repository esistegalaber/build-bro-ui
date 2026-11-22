import {Injectable, inject} from '@angular/core'
import {Actions, createEffect, ofType} from '@ngrx/effects'
import {HttpClient} from '@angular/common/http'
import {select, Store} from '@ngrx/store'
import {Buildz, IBuildSearchResult, ISearchData} from '../../core'
import {catchError, exhaustMap, map, switchMap, tap, withLatestFrom} from 'rxjs/operators'
import {of} from 'rxjs'
import * as AlertActions from '../../core/state/alerts/alert.actions'
import {availableBuildSearchDataLoaded, buildSearchLoaded, doBuildSearch, loadAvailableBuildSearchData, resetSearchParams, toSearchPage, updateSearchParams} from "./builds.actions";
import {theBuildSearchParams} from "./builds.selectors";

@Injectable()
export class BuildsEffects {
  private actions$ = inject(Actions);
  private http = inject(HttpClient);
  private store = inject<Store<Buildz>>(Store);

  // noinspection JSUnusedLocalSymbols
  doBuildSearch$ = createEffect(() => this.actions$.pipe(
    ofType(doBuildSearch, updateSearchParams, toSearchPage, resetSearchParams),
    withLatestFrom(this.store.pipe(select(theBuildSearchParams))),
    map(([action, buildSearchParams]) => buildSearchParams),
    // the newest search wins: a newer one cancels a request still running, so the results match the filters
    switchMap((buildSearchParams) => this.http.post<IBuildSearchResult>(`/api/v1/builds/search`, buildSearchParams).pipe(
        map((result: IBuildSearchResult) => buildSearchLoaded({result})),
        catchError(errorResponse => of(AlertActions.backendErrorOccurred({errorResponse})))
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
}

