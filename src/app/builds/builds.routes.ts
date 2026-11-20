import {Route} from "@angular/router";
import {BuildsPage} from "./builds.page";
import {provideState} from "@ngrx/store";
import {buildReducer, FEATURE_BUILDS} from "./state/builds.reducer";
import {provideEffects} from "@ngrx/effects";
import {BuildsEffects} from "./state/builds.effects";

export const buildsRoutes: Route[] = [
  {
    path: '',
    component: BuildsPage,
    providers: [
      provideState(FEATURE_BUILDS, buildReducer),
      provideEffects(BuildsEffects)
    ]
  }
]
