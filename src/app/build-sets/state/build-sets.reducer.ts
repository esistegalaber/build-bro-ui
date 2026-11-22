import {createReducer, on} from '@ngrx/store'
import * as BuildSetActions from './build-sets.actions'
import {BuildSetsState} from "./build-sets.model";

export const INITIAL_BUILD_SETS_STATE: BuildSetsState = {
  templates: [],
  selected: null,
  buildSet: {
    name: '',
    builds: {}
  }
}

export const buildSetReducer = createReducer(
  INITIAL_BUILD_SETS_STATE,
  on(BuildSetActions.buildSetTemplatesLoaded, (state, {templates}) => {
    return {...state, templates}
  }),
  on(BuildSetActions.loadBuildSetOf, (state, {templateName}) => {
    return {...state, selected: templateName}
  }),
  on(BuildSetActions.buildSetLoaded, (state, {buildSet}) => {
    return {...state, buildSet}
  }),
  on(BuildSetActions.buildSetTemplateDeleted, (state, {name}) => {
    const templates = state.templates.filter((template) => template.name !== name)
    return state.selected === name
      ? {...state, templates, selected: null, buildSet: INITIAL_BUILD_SETS_STATE.buildSet}
      : {...state, templates}
  })
)
