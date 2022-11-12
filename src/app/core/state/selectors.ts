import * as Model from './model'
import {IAlert} from './model'
import {createFeatureSelector} from "@ngrx/store";

export const alertState = createFeatureSelector<IAlert>('alert')
export const theBuildStats = (state: Model.Buildz): Model.IBuildStats => state.stats
