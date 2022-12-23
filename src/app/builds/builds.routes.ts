import {Route} from "@angular/router";
import {BuildsPage} from "./builds.page";
import {StoreModule} from "@ngrx/store";
import {importProvidersFrom} from "@angular/core";
import {buildReducer, FEATURE_BUILDS} from "./state/builds.reducer";
import {EffectsModule} from "@ngrx/effects";
import {BuildsEffects} from "./state/builds.effects";

export const buildsRoutes: Route[] = [
  {
    path: '',
    component: BuildsPage,
    providers: [
      importProvidersFrom(
        StoreModule.forFeature(FEATURE_BUILDS, buildReducer),
        EffectsModule.forFeature(BuildsEffects)
      )]
  }
]
