import * as Model from './model'
import {IAlert, IProject} from './model'
import {createFeatureSelector, createSelector} from "@ngrx/store";
import {deepClone} from "../util/deep-clone";

export const alertState = createFeatureSelector<IAlert>('alert')
export const theBuildStats = (state: Model.Buildz): Model.IBuildStats => state.stats
export const theSideNavState = (state: Model.Buildz): Model.ISideNav => state.nav.sidenav
export const theProjectsState = (state: Model.Buildz): Model.ProjectsState => state.projects
export const allActiveProjects = createSelector(
  theProjectsState, (state: Model.ProjectsState): IProject[] => {
    let toReturn: IProject[] = deepClone(state.projects.filter(p => p.active))
    toReturn.forEach(project => project.branches = project.branches.filter(b => b.active))
    return toReturn
  }
)

