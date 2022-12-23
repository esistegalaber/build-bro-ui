import {Route} from "@angular/router";
import {DeploymentsPage} from "./deployments.page";
import {importProvidersFrom} from "@angular/core";
import {StoreModule} from "@ngrx/store";
import {deploymentsReducer, FEATURE_DEPLOYMENTS} from "./state/deployment.reducer";
import {EffectsModule} from "@ngrx/effects";
import {DeploymentEffects} from "./state/deployment.effects";

export const deploymentsRoutes: Route[] = [
  {
    path: '', component: DeploymentsPage,
    providers: [importProvidersFrom([
        StoreModule.forFeature(FEATURE_DEPLOYMENTS, deploymentsReducer),
        EffectsModule.forFeature([DeploymentEffects])
      ]
    )]
  }
]
