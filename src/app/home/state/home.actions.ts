import {createAction, props} from '@ngrx/store'
import {IBuildSetTemplate, IDeployment} from '../../core'

export const loadHome = createAction('[HOME] LOAD')
export const recentDeploymentsLoaded = createAction('[HOME] RECENT-DEPLOYMENTS-LOADED', props<{ deployments: IDeployment[] }>())
export const homeBuildSetsLoaded = createAction('[HOME] BUILD-SETS-LOADED', props<{ templates: IBuildSetTemplate[] }>())
