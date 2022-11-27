import {createFeatureSelector, createSelector} from "@ngrx/store";
import * as Model from "../../core/";
import {IBuild, IBuildDataTreeNode, ISearchData} from "../../core/";
import {toBuildNode} from "./utils";
import {theProjectsState} from "../../core/state/selectors";


export const buildsState = createFeatureSelector<Model.IBuildsState>('builds')
export const theBuildSearchParams = createSelector(
  buildsState, (state: Model.IBuildsState): Model.IBuildSearchParams => state.search
)
export const theBuildSearchResult = createSelector(
  buildsState, (state: Model.IBuildsState): Model.IBuildSearchResult => state.result
)
export const theBuilds = createSelector(
  buildsState, (state: Model.IBuildsState): Model.IBuild[] => state.result.data
)
export const availableSearchData = createSelector(
  buildsState, (state: Model.IBuildsState): Model.ISearchData => state.available
)

export const theBuildSearchPaginationParams = createSelector(buildsState,
  buildsState, (state: Model.IBuildsState): Model.IPaginationParams => {
    return {
      totalElements: state.result.totalElements,
      pageSize: state.search.pageSize,
      currentPage: state.search.page + 1
    }
  }
)

export const theBuildsAsTreeData = createSelector(
  theBuilds, (state: Model.IBuild[]): IBuildDataTreeNode[] => state?.map(toBuildNode)
)

export const firstBuild = createSelector(
  theBuilds, (state: Model.IBuild[]): IBuild => state[0]
)

export const theBuildLabelGroups = createSelector(
  theBuildsAsTreeData, (state: IBuildDataTreeNode[]): string[] => state.filter(node => node.name.indexOf(".") > 0).map(node => node.name.substring(0.))
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

