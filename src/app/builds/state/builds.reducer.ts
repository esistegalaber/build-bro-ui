import {createReducer, on} from '@ngrx/store'
import {IBuildSearchResult} from '../../core'
import {deepClone} from '../../core/util/deep-clone'
import {addSearchLabel, availableBuildSearchDataLoaded, buildSearchLoaded, removeSearchLabel, resetSearchParams, searchBuildsOfProject, toSearchPage, updateSearchParams} from "./builds.actions";
import {BuildsState} from "./builds.model";

export const INITIAL_BUILD_SEARCH: BuildsState = {
  search: {
    project: '',
    branch: '',
    page: 0,
    pageSize: 10,
    labels: {},
    sortAttribute: 'buildNumber',
    sortDirection: 'DESC',
    minBuildNumber: null,
    maxBuildNumber: null
  },
  result: {} as IBuildSearchResult,
}


export const buildReducer = createReducer(
  INITIAL_BUILD_SEARCH,
  on(buildSearchLoaded, (state: BuildsState, {result}) => {
    return {...state, result}
  }),
  on(availableBuildSearchDataLoaded, (state: BuildsState, {available}) => {
    return {...state, available}
  }),
  on(updateSearchParams, (state: BuildsState, {search}) => {
    let newSearch = {...search}
    if (state.search.project !== search.project || state.search.branch !== search.branch || state.search.pageSize !== search.pageSize) {
      newSearch.page = 0;
    }
    return {...state, search: newSearch}
  }),
  on(toSearchPage, (state: BuildsState, {page}) => {
    const newSearch = {...state.search, page: page}
    return {
      ...state,
      search: newSearch
    }
  }),
  on(addSearchLabel, (state: BuildsState, {label}) => {
    const newState: BuildsState = deepClone(state)
    newState.search.labels[label.key] = label.value
    return newState
  }),
  on(removeSearchLabel, (state: BuildsState, {label}) => {
    const newState: BuildsState = deepClone(state)
    delete newState.search.labels[label.key]
    return newState
  }),
  on(resetSearchParams, (state: BuildsState) => {
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
  on(searchBuildsOfProject, (state: BuildsState, {project}) => {
    const toReturn: BuildsState = deepClone(state)
    toReturn.search.project = project
    return toReturn
  })
)
