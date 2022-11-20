import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import * as BuildSetActions from './build-sets.actions'
import {catchError, exhaustMap, map, switchMap} from "rxjs/operators";
import {backendErrorOccurred} from "../../core/state/alerts/alert.actions";
import {of} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Store} from "@ngrx/store";
import {Buildz, IBuildSet} from "../../core";
import {Router} from "@angular/router";

@Injectable()
export class BuildSetsEffects {
  loadKnownTemplateNames = createEffect(() => this.actions$.pipe(
    ofType(BuildSetActions.loadBuildSetNames),
    exhaustMap(() => this.http.get<string[]>(`/api/v1/build-sets/names`).pipe(
      map((names: string[]) => BuildSetActions.buildSetNamesLoaded({names})),
      catchError((errorResponse) => of(backendErrorOccurred({errorResponse})))
    ))
  ))

  buildsOf$ = createEffect(() => this.actions$.pipe(
    ofType(BuildSetActions.loadBuildSetOf),
    map((action) => action.templateName),
    switchMap((templateName) => this.http.get<IBuildSet>(`/api/v1/build-sets/of/${templateName}`).pipe(
      map((buildSet: IBuildSet) =>
        BuildSetActions.buildSetLoaded({buildSet})
      ),
      catchError(errorResponse => of(backendErrorOccurred({errorResponse})))
    ))
  ))

  constructor(private actions$: Actions, private http: HttpClient, private store: Store<Buildz>, private router: Router) {
  }
}
