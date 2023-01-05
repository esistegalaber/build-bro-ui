import {createReducer, on} from '@ngrx/store'
import * as EditBuildSetActions from './edit-build-sets.actions'
import {navigateTo} from './edit-build-sets.actions'
import {IBuildSet, IBuildSetTemplate} from "../../core";
import {deepClone} from "../../core/util/deep-clone";

export const FEATURE_EDIT_BUILD_SET = 'edit-build-set'
export const NAV_PROJECTS: string = 'projects'
export const NAV_BRANCHES: string = 'branches'
export const NAV_LABELS: string = 'labels'
export const NAV_VERIFICATION: string = 'verification'

/**
 * Defines the state for this 'Edit a BuildSetTemplate' Feature.
 */
export interface EditBuildSetState {
  theTemplate: IBuildSetTemplate
  buildSet: IBuildSet,
}

/**
 * The actual initial state.
 */
export const INITIAL_STATE: EditBuildSetState = {
  theTemplate: {
    name: '',
    buildTemplates: []
  },
  buildSet: {
    name: '',
    builds: {}
  }
}
export const editBuildSetReducer = createReducer(
  INITIAL_STATE,
  on(EditBuildSetActions.buildSetTemplateLoaded, (state: EditBuildSetState, {theTemplate}) => {
    return {...state, theTemplate}
  }),
  on(EditBuildSetActions.buildSetTemplateToCloneLoaded, (state: EditBuildSetState, {theTemplate}) => {
    const theNewTemplate = {...theTemplate}
    theNewTemplate.id = null
    theNewTemplate.name = `CLONE-OF-${theTemplate.name}`
    return {...state, theTemplate: theNewTemplate}
  }),
  on(EditBuildSetActions.buildSetLoaded, (state: EditBuildSetState, {buildSet}) => {
    return {...state, buildSet}
  }),
  on(EditBuildSetActions.newBuildSet, (state: EditBuildSetState) => {
    return INITIAL_STATE
  }),
  on(EditBuildSetActions.projectAdded, (state: EditBuildSetState, {project}) => {
    const theTemplate: IBuildSetTemplate = deepClone(state.theTemplate)
    theTemplate.buildTemplates.push({
      project: project.name,
      branch: null,
      labels: {},
      buildNumber: null
    })
    return {...state, theTemplate};
  }),
  on(EditBuildSetActions.projectRemoved, (state: EditBuildSetState, {project}) => {
    const theTemplate: IBuildSetTemplate = deepClone(state.theTemplate)
    theTemplate.buildTemplates = theTemplate.buildTemplates.filter((b) => b.project !== project.name)
    return {...state, theTemplate};
  }),
  on(EditBuildSetActions.buildTemplateUpdated, (state: EditBuildSetState, {buildTemplate}) => {
    const theTemplate: IBuildSetTemplate = deepClone(state.theTemplate)
    const theBuildTemplate = theTemplate.buildTemplates
      .find((template) => template.project === buildTemplate.project.name)
    if (!!theBuildTemplate) {
      theBuildTemplate.branch = buildTemplate.branch?.name || null
      theBuildTemplate.buildNumber = buildTemplate.buildNumber
    }
    return {...state, theTemplate};
  }),
  on(EditBuildSetActions.saveWith, (state: EditBuildSetState, {name}) => {
    const theTemplate = {...state.theTemplate}
    theTemplate.name = name
    return {...state, theTemplate};
  })
)
