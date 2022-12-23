import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {Store} from "@ngrx/store";
import {Buildz, IServer} from "../model";
import {HttpClient} from "@angular/common/http";
import * as ServerActions from "./server.actions";
import {of, switchMap} from "rxjs";
import {catchError, map} from "rxjs/operators";
import {backendErrorOccurred} from "../alerts/alert.actions";

@Injectable()
export class ServerEffects {
  loadServers$ = createEffect(() => this.actions$.pipe(
    ofType(ServerActions.loadServers),
    switchMap(() => this.http.get<IServer[]>('/api/v1/servers').pipe(
      map((servers: IServer[]) => ServerActions.serversLoaded({servers})),
      catchError((errorResponse) => of(backendErrorOccurred({errorResponse})))
    ))
  ))
  updateSingleServer$ = createEffect(() => this.actions$.pipe(
    ofType(ServerActions.updateServer),
    map((action) => action.server),
    switchMap((server: IServer) => this.http.post<IServer>('/api/v1/servers', server).pipe(
      map((updated: IServer) => ServerActions.serverUpdated({server: updated})),
      catchError((errorResponse) => of(backendErrorOccurred({errorResponse})))
    ))
  ))

  constructor(private actions$: Actions, private store: Store<Buildz>, private http: HttpClient) {
  }
}
