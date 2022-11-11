import {createReducer, on} from '@ngrx/store'
import {IBuildSearchResult, IBuildsState} from '../../core'
import {deepClone} from '../../core/util/deep-clone'
import {addSearchLabel, availableBuildSearchDataLoaded, buildSearchLoaded, removeSearchLabel, resetSearchParams, searchBuildsOfProject, updateSearchParams} from "./builds.actions";

export const INITIAL_BUILD_SEARCH: IBuildsState = {
  search: {
    project: '',
    branch: '',
    page: 0,
    pageSize: 50,
    labels: {},
    sortAttribute: 'buildNumber',
    sortDirection: 'DESC',
    minBuildNumber: null,
    maxBuildNumber: null
  },
  result: {} as IBuildSearchResult,
  available: {
    projectNames: [],
    projectBranches: {},
    labelKeys: []
  }
}


export const buildReducer = createReducer(
  INITIAL_BUILD_SEARCH,
  on(buildSearchLoaded, (state: IBuildsState, {result}) => {
    return {...state, result}
  }),
  on(availableBuildSearchDataLoaded, (state: IBuildsState, {available}) => {
    return {...state, available}
  }),
  on(updateSearchParams, (state: IBuildsState, {search}) => {
    return {...state, search}
  }),
  on(addSearchLabel, (state: IBuildsState, {label}) => {
    const newState: IBuildsState = deepClone(state)
    newState.search.labels[label.key] = label.value
    return newState
  }),
  on(removeSearchLabel, (state: IBuildsState, {label}) => {
    const newState: IBuildsState = deepClone(state)
    delete newState.search.labels[label.key]
    return newState
  }),
  on(resetSearchParams, (state: IBuildsState) => {
    return {
      ...state, search: {
        project: '',
        branch: '',
        page: 0,
        pageSize: 50,
        labels: {},
        sortAttribute: 'buildNumber',
        sortDirection: 'DESC',
        minBuildNumber: null,
        maxBuildNumber: null
      }
    }
  }),
  on(searchBuildsOfProject, (state: IBuildsState, {project}) => {
    const toReturn: IBuildsState = deepClone(state)
    toReturn.search.project = project
    return toReturn
  })
)