import {Injectable, inject} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {HttpClient} from "@angular/common/http";
import {of, switchMap} from "rxjs";
import {catchError, map} from "rxjs/operators";
import {ILabelDefinition} from "../model";
import * as LabelActions from "./label.actions";
import {backendErrorOccurred} from "../alerts/alert.actions";

@Injectable()
export class LabelEffects {
  private actions$ = inject(Actions);
  private http = inject(HttpClient);

  loadDefinitions$ = createEffect(() => this.actions$.pipe(
    ofType(LabelActions.loadLabelDefinitions),
    switchMap(() => this.http.get<ILabelDefinition[]>('/api/v1/label-definitions').pipe(
      map((definitions: ILabelDefinition[]) => LabelActions.labelDefinitionsLoaded({definitions})),
      catchError((errorResponse) => of(backendErrorOccurred({errorResponse})))
    ))
  ))
}
