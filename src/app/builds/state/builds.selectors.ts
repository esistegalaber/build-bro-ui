import {createFeatureSelector, createSelector} from "@ngrx/store";
import * as Model from "../../core/";
import {ISearchData} from "../../core/";
import {theProjectsState} from "../../core";
import {BuildsState, FEATURE_BUILDS} from "./builds.reducer";


export const buildsState = createFeatureSelector<BuildsState>(FEATURE_BUILDS)
export const theBuildSearchParams = createSelector(
  buildsState, (state: BuildsState): Model.IBuildSearchParams => state.search
)
export const theBuildSearchResult = createSelector(
  buildsState, (state: BuildsState): Model.IBuildSearchResult => state.result
)
export const theBuilds = createSelector(
  buildsState, (state: BuildsState): Model.IBuild[] => state.result.data
)
export const theBuildSearchPaginationParams = createSelector(buildsState,
  buildsState, (state: BuildsState): Model.IPaginationParams => {
    return {
      totalElements: state.result.totalElements,
      totalPages: state.result.totalPages,
      pageSize: state.search.pageSize,
      currentPage: state.search.page,
      hasNext: state.result.hasNext,
      hasPrevious: state.result.hasPrevious

    }
  }
)

export const searchData = createSelector(
  theProjectsState, (state: Model.ProjectsState): ISearchData => {
    const projectBranches: { [key: string]: string[] } = {}
    const theProjects = state.projects.filter(p => p.active)
    theProjects.forEach(project => {
      projectBranches[project.name] = project.branches.filter(b => b.active).map(b => b.name)
    })
    const projectNames = theProjects.map(p => p.name)
    const labelKeys: string[] = []
    return {projectNames, projectBranches, labelKeys}
  }
)

