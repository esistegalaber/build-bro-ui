import {createAction, props} from "@ngrx/store";
import {IServer} from "../model";

export const loadServers = createAction('[SERVERS] LOAD-ALL')
export const serversLoaded = createAction('[SERVERS] ALL-SERVERS-LOADED', props<{ servers: IServer[] }>())
export const updateServer = createAction('[SERVERS] UPDATE-SINGLE-SERVER', props<{ server: IServer }>())
export const serverUpdated = createAction('[SERVERS] SINGLE-SERVER-UPDATED', props<{ server: IServer }>())
