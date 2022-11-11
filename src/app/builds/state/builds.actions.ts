import {createAction, props} from "@ngrx/store";
import {IBuildLabel, IBuildSearchParams, IBuildSearchResult, ISearchData} from "../../core";

export const doBuildSearch = createAction('[BUILD] DO-BUILD-SEARCH')
export const loadAvailableBuildSearchData = createAction('[BUILD] LOAD-AVAILABLE-BUILD-SEARCH-DATA')
export const availableBuildSearchDataLoaded = createAction('[BUILD] AVAILABLE-BUILD-SEARCH-DATA-LOADED', props<{ available: ISearchData }>())
export const updateSearchParams = createAction('[BUILD] UPDATE-SEARCH-PARAMS', props<{ search: IBuildSearchParams }>())
export const addSearchLabel = createAction('[BUILD] ADD-SEARCH-LABEL', props<{ label: IBuildLabel }>())
export const removeSearchLabel = createAction('[BUILD] REMOVE-SEARCH-LABEL', props<{ label: IBuildLabel }>())
export const resetSearchParams = createAction('[BUILD] RESET-SEARCH-PARAMS')
export const searchBuildsOfProject = createAction('[BUILD] SEARCH-BUILDS-OF-PROJECT', props<{ project: string }>())
export const buildSearchLoaded = createAction('[BUILD] BUILDS-SEARCH-LOADED', props<{ result: IBuildSearchResult }>())
