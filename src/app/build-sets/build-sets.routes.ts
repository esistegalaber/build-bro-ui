import {Route} from "@angular/router";
import {BuildSetsPage} from "./build-sets.page";
import {inject} from "@angular/core";
import {provideState, Store} from "@ngrx/store";
import {FEATURE_BUILD_SETS} from "./state/build-sets.model";
import {buildSetReducer} from "./state/build-sets.reducer";
import {provideEffects} from "@ngrx/effects";
import {BuildSetsEffects} from "./state/build-sets.effects";
import {Buildz} from "../core";
import * as BuildSetActions from "./state/build-sets.actions";

export const buildSetRoutes: Route[] = [
  {
    path: '',
    component: BuildSetsPage,
    providers: [
      provideState(FEATURE_BUILD_SETS, buildSetReducer),
      provideEffects(BuildSetsEffects)
    ],
    canActivate: [() => loadBuildSetTemplates()]
  }
]

function loadBuildSetTemplates(): boolean {
  inject(Store<Buildz>).dispatch(BuildSetActions.loadBuildSetTemplates())
  return true
}
