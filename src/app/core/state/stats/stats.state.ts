import {IBuildStats} from '../model'
import {createAction, createReducer, on, props} from '@ngrx/store'

export const loadBuildStats = createAction('LOAD-BUILD-STATS')
export const buildStatsLoaded = createAction('BUILD-STATS-LOADED', props<{ stats: IBuildStats }>())

export const EMPTY_BUILD_STATS: IBuildStats = {
  numberOfLabels: 0,
  numberOfBuilds: 0,
  numberOfDeploys: 0,
  numberOfBranches: 0,
  numberOfProjects: 0
}

export const statsReducer = createReducer(
  EMPTY_BUILD_STATS,
  on(buildStatsLoaded, (state: IBuildStats, {stats}) => stats)
)
