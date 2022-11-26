import * as Model from './model'
import {IAlert, INavState, ISideNav} from './model'
import {createFeatureSelector, createSelector} from "@ngrx/store";
import {state} from "@angular/animations";

export const alertState = createFeatureSelector<IAlert>('alert')
export const theBuildStats = (state: Model.Buildz): Model.IBuildStats => state.stats
export const theSideNavState = (state: Model.Buildz): Model.ISideNav => state.nav.sidenav
export const theProjectsState = (state: Model.Buildz): Model.ProjectsState => state.projects
