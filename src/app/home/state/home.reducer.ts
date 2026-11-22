import {createReducer, on} from '@ngrx/store'
import {IBuildSetTemplate, IDeployment} from '../../core'
import * as HomeActions from './home.actions'

export const FEATURE_HOME = 'home'

/** What the home page shows besides the stats. null: not loaded yet. */
export interface HomeState {
  recentDeployments: IDeployment[] | null
  buildSets: IBuildSetTemplate[] | null
}

export const INITIAL_HOME_STATE: HomeState = {
  recentDeployments: null,
  buildSets: null
}

export const homeReducer = createReducer(
  INITIAL_HOME_STATE,
  on(HomeActions.recentDeploymentsLoaded, (state, {deployments}) => ({...state, recentDeployments: deployments})),
  on(HomeActions.homeBuildSetsLoaded, (state, {templates}) => ({...state, buildSets: templates}))
)
