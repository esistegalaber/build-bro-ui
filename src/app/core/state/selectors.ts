import * as Model from './model'
import {IAlert, IProject} from './model'
import {createFeatureSelector, createSelector} from "@ngrx/store";
import {deepClone} from "../util/deep-clone";

export const alertState = createFeatureSelector<IAlert>('alert')
export const theBuildStats = (state: Model.Buildz): Model.IBuildStats => state.stats
export const theSideNavState = (state: Model.Buildz): Model.ISideNav => state.nav.sidenav

