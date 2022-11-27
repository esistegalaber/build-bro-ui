import {createReducer, on} from '@ngrx/store'
import * as EditBuildSetActions from './edit-build-sets.actions'
import {IBuildSetTemplate} from "../../core";
import {deepClone} from "../../core/util/deep-clone";
import {EditBuildSetState} from "./edit-build-sets.model";

export const INITIAL_STATE: EditBuildSetState = {
  theTemplate: {
    name: '',
    projects: [],
    buildTemplates: []
  },
  buildSet: {
    name: '',
    builds: {}
  }
}
export const editBuildSetReducer = createReducer(
  INITIAL_STATE,
  on(EditBuildSetActions.buildSetLoaded, (state: EditBuildSetState, {buildSet}) => {
    return {...state, buildSet}
  }),
  on(EditBuildSetActions.newBuildSet, (state: EditBuildSetState) => {
    return INITIAL_STATE
  }),
  on(EditBuildSetActions.changeProjectSelection, (state: EditBuildSetState, {project, selected}) => {
    const theTemplate: IBuildSetTemplate = deepClone(state.theTemplate)
    if (selected) {
      theTemplate.projects.push(project)
      theTemplate.buildTemplates.push({
        project: project,
        branch: null,
        labels: {},
        buildNumber: null
      })

    } else {
      theTemplate.projects = theTemplate.projects.filter((p) => p.id !== project.id)
      theTemplate.buildTemplates = theTemplate.buildTemplates.filter((b) => b.project.id !== project.id)
    }
    return {...state, theTemplate};
  }),
  on(EditBuildSetActions.buildTemplateUpdated, (state: EditBuildSetState, {buildTemplate}) => {
    const theTemplate: IBuildSetTemplate = deepClone(state.theTemplate)
    theTemplate.buildTemplates = theTemplate.buildTemplates.filter((template) => template.project.id !== buildTemplate.project.id)
    theTemplate.buildTemplates.push(buildTemplate)
    return {...state, theTemplate};
  })
)
