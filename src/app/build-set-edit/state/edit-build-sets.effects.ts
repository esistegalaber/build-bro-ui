import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import * as EditBuildSetActions from './edit-build-sets.actions'
import {catchError, map, switchMap, withLatestFrom} from "rxjs/operators";
import {backendErrorOccurred} from "../../core/state/alerts/alert.actions";
import {of} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {select, Store} from "@ngrx/store";
import {Buildz, IBuildSet} from "../../core";
import * as CoreActions from "../../core/actions";
import {Router} from "@angular/router";
import {theCurrentBuildTemplatesForVerification} from "./edit-build-sets.selectors";

@Injectable()
export class EditBuildSetsEffects {
  verifyBuildsOfEnv$ = createEffect(() => this.actions$.pipe(
    ofType(EditBuildSetActions.buildTemplateUpdated),
    withLatestFrom(this.store.pipe(select(theCurrentBuildTemplatesForVerification))),
    switchMap(([action, artifacts]) => this.http.post<IBuildSet>(`/api/v1/build-sets/verify`, artifacts).pipe(
      map((buildSet: IBuildSet) => EditBuildSetActions.buildSetLoaded({buildSet})),
      catchError(errorResponse => of(CoreActions.backendErrorOccurred({errorResponse})))
    ))
  ))


  constructor(private actions$: Actions, private http: HttpClient, private store: Store<Buildz>, private router: Router) {
  }
}
