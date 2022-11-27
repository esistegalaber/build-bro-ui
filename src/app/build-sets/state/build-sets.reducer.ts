import {createReducer, on} from '@ngrx/store'
import * as BuildSetActions from './build-sets.actions'
import {IBuildSetState} from "../../core";
import {BuildSetsState} from "./build-sets.model";

export const INITIAL_ENVIRONMENT_BUILDS: BuildSetsState = {
  names: [],
  buildSet: {
    name: '',
    builds: {}
  }
}
export const buildSetReducer = createReducer(
  INITIAL_ENVIRONMENT_BUILDS,
  on(BuildSetActions.buildSetNamesLoaded, (state: BuildSetsState, {names}) => {
    return {
      ...state, names
    }
  }),
  on(BuildSetActions.buildSetLoaded, (state: BuildSetsState, {buildSet}) => {
    return {...state, buildSet}
  })
)
