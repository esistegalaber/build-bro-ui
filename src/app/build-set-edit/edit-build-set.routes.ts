import {Route} from "@angular/router";
import {importProvidersFrom, inject} from "@angular/core";
import {Store, StoreModule} from "@ngrx/store";
import {FEATURE_EDIT_BUILD_SET} from "./state/edit-build-sets.model";
import {editBuildSetReducer} from "./state/edit-build-sets.reducer";
import {EffectsModule} from "@ngrx/effects";
import {EditBuildSetsEffects} from "./state/edit-build-sets.effects";
import {EditBuildSetPage} from "./edit-build-set.page";
import {Buildz} from "../core";
import * as EditBuildSetActions from "./state/edit-build-sets.actions";

export const routes: Route[] = [
  {
    path: '',
    providers: [
      importProvidersFrom([
        StoreModule.forFeature(FEATURE_EDIT_BUILD_SET, editBuildSetReducer),
        EffectsModule.forFeature(EditBuildSetsEffects)
      ])
    ],
    component: EditBuildSetPage,
    canActivate: [() => dispatchNewBuildSet()]
  }
]


function dispatchNewBuildSet() {
  inject(Store<Buildz>).dispatch(EditBuildSetActions.newBuildSet())
  return true;
}
