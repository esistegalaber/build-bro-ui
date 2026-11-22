import {Injectable, inject} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import * as BuildSetActions from './build-sets.actions'
import * as CoreActions from '../../core/actions'
import {catchError, map, switchMap} from "rxjs/operators";
import {of} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {IBuildSet, IBuildSetTemplate} from "../../core";

@Injectable()
export class BuildSetsEffects {
  private actions$ = inject(Actions);
  private http = inject(HttpClient);

  loadTemplates$ = createEffect(() => this.actions$.pipe(
    ofType(BuildSetActions.loadBuildSetTemplates),
    switchMap(() => this.http.get<IBuildSetTemplate[]>(`/api/v1/build-sets`).pipe(
      map((templates: IBuildSetTemplate[]) => BuildSetActions.buildSetTemplatesLoaded({templates})),
      catchError((errorResponse) => of(CoreActions.backendErrorOccurred({errorResponse})))
    ))
  ))

  buildsOf$ = createEffect(() => this.actions$.pipe(
    ofType(BuildSetActions.loadBuildSetOf),
    map((action) => action.templateName),
    switchMap((templateName) => this.http.get<IBuildSet>(`/api/v1/build-sets/of/${encodeURIComponent(templateName)}`).pipe(
      map((buildSet: IBuildSet) => BuildSetActions.buildSetLoaded({buildSet})),
      catchError(errorResponse => of(CoreActions.backendErrorOccurred({errorResponse})))
    ))
  ))

  delete$ = createEffect(() => this.actions$.pipe(
    ofType(BuildSetActions.deleteBuildSetTemplate),
    switchMap(({name}) => this.http.delete(`/api/v1/build-sets/${encodeURIComponent(name)}`).pipe(
      map(() => BuildSetActions.buildSetTemplateDeleted({name})),
      catchError(errorResponse => of(CoreActions.backendErrorOccurred({errorResponse})))
    ))
  ))
}
