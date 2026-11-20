import {Route} from "@angular/router";
import {DeploymentsPage} from "./deployments.page";
import {provideState} from "@ngrx/store";
import {deploymentsReducer, FEATURE_DEPLOYMENTS} from "./state/deployment.reducer";
import {provideEffects} from "@ngrx/effects";
import {DeploymentEffects} from "./state/deployment.effects";

export const deploymentsRoutes: Route[] = [
  {
    path: '', component: DeploymentsPage,
    providers: [
      provideState(FEATURE_DEPLOYMENTS, deploymentsReducer),
      provideEffects(DeploymentEffects)
    ]
  }
]
