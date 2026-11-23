import {Injectable, inject} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {HttpClient} from "@angular/common/http";
import {of, switchMap} from "rxjs";
import {catchError, concatMap, map, mergeMap} from "rxjs/operators";
import {ILabelDefinitionChange, ILabelSettings, ILabelViolation} from "../../core";
import {backendErrorOccurred} from "../../core/state/alerts/alert.actions";
import {labelDefinitionDeleted, labelDefinitionSaved} from "../../core/state/labels/label.actions";
import * as LabelAdminActions from "./labels-admin.actions";

const API = '/api/v1'

@Injectable()
export class LabelAdminEffects {
  private actions$ = inject(Actions);
  private http = inject(HttpClient);

  loadViolations$ = createEffect(() => this.actions$.pipe(
    // the report changes whenever a definition does
    ofType(LabelAdminActions.loadLabelAdmin, labelDefinitionSaved, labelDefinitionDeleted),
    switchMap(() => this.http.get<ILabelViolation[]>(`${API}/label-violations`).pipe(
      map((violations) => LabelAdminActions.labelViolationsLoaded({violations})),
      catchError((errorResponse) => of(backendErrorOccurred({errorResponse})))
    ))
  ))

  loadSettings$ = createEffect(() => this.actions$.pipe(
    ofType(LabelAdminActions.loadLabelAdmin),
    switchMap(() => this.http.get<ILabelSettings>(`${API}/label-settings`).pipe(
      map((settings) => LabelAdminActions.labelSettingsLoaded({settings})),
      catchError((errorResponse) => of(backendErrorOccurred({errorResponse})))
    ))
  ))

  saveSettings$ = createEffect(() => this.actions$.pipe(
    ofType(LabelAdminActions.saveLabelSettings),
    concatMap(({settings}) => this.http.put<ILabelSettings>(`${API}/label-settings`, settings).pipe(
      map((saved) => LabelAdminActions.labelSettingsLoaded({settings: saved})),
      catchError((errorResponse) => of(backendErrorOccurred({errorResponse})))
    ))
  ))

  preview$ = createEffect(() => this.actions$.pipe(
    ofType(LabelAdminActions.previewLabelDefinition),
    // only the newest preview matters
    switchMap(({key, definition}) => this.http.put<ILabelDefinitionChange>(
      `${API}/label-definitions/${encodeURIComponent(key)}`, definition, {params: {dryRun: true}}).pipe(
      map((change) => LabelAdminActions.labelDefinitionPreviewed({change})),
      catchError((errorResponse) => of(backendErrorOccurred({errorResponse})))
    ))
  ))

  save$ = createEffect(() => this.actions$.pipe(
    ofType(LabelAdminActions.saveLabelDefinition),
    concatMap(({key, definition}) => this.http.put<ILabelDefinitionChange>(
      `${API}/label-definitions/${encodeURIComponent(key)}`, definition).pipe(
      map((change) => labelDefinitionSaved({change})),
      catchError((errorResponse) => of(backendErrorOccurred({errorResponse})))
    ))
  ))

  delete$ = createEffect(() => this.actions$.pipe(
    ofType(LabelAdminActions.deleteLabelDefinition),
    mergeMap(({key}) => this.http.delete(`${API}/label-definitions/${encodeURIComponent(key)}`).pipe(
      map(() => labelDefinitionDeleted({key})),
      catchError((errorResponse) => of(backendErrorOccurred({errorResponse})))
    ))
  ))
}
