import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import * as EditBuildSetActions from './edit-build-sets.actions'
import {catchError, map, switchMap, tap, withLatestFrom} from "rxjs/operators";
import {of} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {select, Store} from "@ngrx/store";
import {Buildz, IBuildSet, IBuildSetTemplate} from "../../core";
import * as CoreActions from "../../core/actions";
import {Router} from "@angular/router";
import {theBuildTemplates, theTemplate} from "./edit-build-sets.selectors";
import {buildSetTemplateLoaded} from "./edit-build-sets.actions";

@Injectable()
export class EditBuildSetsEffects {
  verifyBuildsOfEnv$ = createEffect(() => this.actions$.pipe(
    ofType(EditBuildSetActions.buildTemplateUpdated, EditBuildSetActions.buildSetTemplateLoaded),
    withLatestFrom(this.store.pipe(select(theBuildTemplates))),
    switchMap(([action, theBuildTemplates]) => this.http.post<IBuildSet>(`/api/v1/build-sets/verify`, theBuildTemplates).pipe(
      map((buildSet: IBuildSet) => EditBuildSetActions.buildSetLoaded({buildSet})),
      catchError(errorResponse => of(CoreActions.backendErrorOccurred({errorResponse})))
    ))
  ))

  save$ = createEffect(() => this.actions$.pipe(
    ofType(EditBuildSetActions.saveWith),
    withLatestFrom(this.store.pipe(select(theTemplate))),
    switchMap(([action, theTemplate]) => this.http.post<IBuildSetTemplate>(`/api/v1/build-sets`, theTemplate).pipe(
      map((theTemplate: IBuildSetTemplate) => {
        this.store.dispatch(CoreActions.frontendInfo(
          {
            alertMessage:
              {heading: 'Saved', message: `Successfully saved BuildSet Template with id = ${theTemplate.id}`}
          })
        )
        return EditBuildSetActions.buildSetTemplateLoaded({theTemplate})
      }),
      catchError(errorResponse => of(CoreActions.backendErrorOccurred({errorResponse})))
    ))
  ))


  constructor(private actions$: Actions, private http: HttpClient, private store: Store<Buildz>, private router: Router) {
  }
}
