import {Route} from "@angular/router";
import {BuildSetsPage} from "./build-sets.page";
import {importProvidersFrom, inject} from "@angular/core";
import {Store, StoreModule} from "@ngrx/store";
import {FEATURE_BUILD_SETS} from "./state/build-sets.model";
import {buildSetReducer} from "./state/build-sets.reducer";
import {EffectsModule} from "@ngrx/effects";
import {BuildSetsEffects} from "./state/build-sets.effects";
import {Buildz} from "../core";
import * as BuildSetActions from "./state/build-sets.actions";

export const routes: Route[] = [
  {
    path: '',
    component: BuildSetsPage,
    providers: [
      importProvidersFrom([
        StoreModule.forFeature(FEATURE_BUILD_SETS, buildSetReducer),
        EffectsModule.forFeature(BuildSetsEffects)
      ])
    ],
    canActivate: [() => loadBuildSetNames()]
  }
]

function loadBuildSetNames() {
  inject(Store<Buildz>).dispatch(BuildSetActions.loadBuildSetNames())
}
