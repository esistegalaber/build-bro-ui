import {createReducer, on} from "@ngrx/store";
import {IServer, ServersState} from "../model";
import * as ServerActions from "./server.actions";

export const INITIAL_SERVERS_STATE: ServersState = {
  servers: []
}
export const serversReducer = createReducer(
  INITIAL_SERVERS_STATE,
  on(ServerActions.serversLoaded, (state: ServersState, {servers}) => {
    return {...state, servers}
  }),
  on(ServerActions.serverUpdated, (state: ServersState, {server}) => {
    const servers: IServer[] = state.servers.map((currentServer: IServer) => {
      return currentServer.id === server.id ? server : currentServer;
    })
    return {...state, servers}
  })
)
