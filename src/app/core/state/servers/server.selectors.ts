import {createFeatureSelector, createSelector} from "@ngrx/store";
import {IServer, ServersState} from "../model";

export const serversState = createFeatureSelector<ServersState>('servers')
export const allServers = createSelector(
  serversState, (state: ServersState): IServer[] => state.servers
)
