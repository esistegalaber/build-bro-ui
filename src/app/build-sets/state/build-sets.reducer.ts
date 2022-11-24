import {createReducer, on} from '@ngrx/store'
import * as BuildSetActions from './build-sets.actions'
import {IBuildSet, IBuildSetState} from "../../core";

export const INITIAL_ENVIRONMENT_BUILDS: IBuildSetState = {
  names: [],
  currentBuildSetName: '',
  currentTemplate: {
    name: '',
    buildTemplates: []
  },
  buildSet: {
    name: '',
    builds: {}
  }
}
export const buildSetReducer = createReducer(
  INITIAL_ENVIRONMENT_BUILDS,
  on(BuildSetActions.buildSetNamesLoaded, (state: IBuildSetState, {names}) => {
    return {
      ...state, names
    }
  }),
  on(BuildSetActions.buildSetLoaded, (state: IBuildSetState, {buildSet}) => {
    return {...state, buildSet}
  }),
  on(BuildSetActions.newBuildSet, (state: IBuildSetState) => {
    return {
      ...state, buildSet: {
        name: '',
        builds: {}
      }
    }
  })
  // ,
  // on(EnvironmentActions.environmentSelected, (state, {environmentName}) => {
  //   return {...state, currentEnvironmentName: environmentName}
  // }),
  // on(EnvironmentActions.singleEnvironmentLoaded, (state: IEnvironments, {environment}) => {
  //   return {...state, currentEnvironment: environment}
  // }),
  // on(EnvironmentActions.updateCurrentEnvironment, (state: IEnvironments, {environment}) => {
  //   return {...state, currentEnvironment: environment}
  // }),
  // on(EnvironmentActions.environmentToCloneLoaded, (state: IEnvironments, {environment}) => {
  //   const newState: IEnvironments = deepClone(state)
  //   delete newState.currentEnvironment.id
  //   newState.currentEnvironment.name = `CLONED-FROM-${environment.name} - Edit!!`
  //   newState.currentEnvironment.artifacts = environment.artifacts.map((artifact) => {
  //     return {
  //       project: artifact.project,
  //       branch: artifact.branch,
  //       labels: artifact.labels
  //     }
  //   })
  //   return newState
  // }),
  // on(EnvironmentActions.toggleArtifactOfEnvironment, (state: IEnvironments, {projectName}) => {
  //   const newState: IEnvironments = deepClone(state)
  //   const a = newState.currentEnvironment.artifacts.find((artifact: IArtifact) => artifact.project === projectName)
  //   if (!!a) {
  //     newState.currentEnvironment.artifacts = newState.currentEnvironment.artifacts.filter((artifact) => artifact.project !== projectName)
  //   } else {
  //     newState.currentEnvironment.artifacts.push({
  //       project: projectName,
  //       branch: '',
  //       labels: {},
  //     })
  //   }
  //   return newState
  // }),
  // on(EnvironmentActions.addArtifactLabel, (state: IEnvironments, {label}) => {
  //   const newState = deepClone(state)
  //   const theArtifact: IArtifact = newState.currentEnvironment.artifacts.find((artifact) => artifact.project === label.projectName)
  //   if (!!theArtifact) {
  //     theArtifact.labels[label.key] = label.value
  //   }
  //   return newState
  // }),
  // on(EnvironmentActions.removeArtifactLabel, (state: IEnvironments, {label}) => {
  //   const newState = deepClone(state)
  //   const theArtifact: IArtifact = newState.currentEnvironment.artifacts.find((artifact) => artifact.project === label.projectName)
  //   if (!!theArtifact) {
  //     delete theArtifact.labels[label.key]
  //   }
  //   return newState
  // }),
  // on(EnvironmentActions.newEnvironment, (state) => {
  //   const newState: IEnvironments = deepClone(state)
  //   newState.currentEnvironmentName = ''
  //   newState.currentEnvironment = {
  //     name: '',
  //     artifacts: []
  //   }
  //   newState.environmentBuilds = {
  //     environment: '',
  //     builds: {},
  //     internal: false
  //   }
  //   return newState
  // })
)
