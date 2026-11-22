import {createReducer, on} from '@ngrx/store'
import {IBuildSearchParams, IBuildSearchResult} from '../../core'
import {addSearchLabel, availableBuildSearchDataLoaded, buildSearchLoaded, removeSearchLabel, resetSearchParams, searchBuildsOfProject, toSearchPage, updateSearchParams} from "./builds.actions";

export const FEATURE_BUILDS = 'builds'

export interface BuildsState {
  search: IBuildSearchParams
  result: IBuildSearchResult
}

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
    return {...state, search: {...state.search, labels: {...state.search.labels, [label.key]: label.value}}}
  }),
  on(removeSearchLabel, (state: BuildsState, {label}) => {
    const {[label.key]: _, ...labels} = state.search.labels
    return {...state, search: {...state.search, labels}}
  }),
  on(resetSearchParams, (state: BuildsState) => {
    return {...state, search: INITIAL_BUILD_SEARCH.search}
  }),
  on(searchBuildsOfProject, (state: BuildsState, {project}) => {
    return {...state, search: {...state.search, project}}
  })
)
