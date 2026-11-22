import {createFeatureSelector, createSelector} from '@ngrx/store'
import {IDeployment} from '../../core'
import {FEATURE_HOME, HomeState} from './home.reducer'
import {BuildSetSummary, toBuildSetSummary} from '../../build-sets/state/build-sets.model'

export const homeState = createFeatureSelector<HomeState>(FEATURE_HOME)
export const theRecentDeployments = createSelector(
  homeState, (state: HomeState): IDeployment[] | null => state.recentDeployments
)
export const theHomeBuildSets = createSelector(
  homeState, (state: HomeState): BuildSetSummary[] | null => state.buildSets?.map(toBuildSetSummary) ?? null
)
