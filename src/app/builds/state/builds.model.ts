import {IBuildSearchParams, IBuildSearchResult} from "../../core";

export const FEATURE_BUILDS = 'builds'

export interface BuildsState {
  search: IBuildSearchParams
  result: IBuildSearchResult
}
