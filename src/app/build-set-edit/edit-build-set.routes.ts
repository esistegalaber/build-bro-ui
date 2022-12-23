import {Route} from "@angular/router";
import {importProvidersFrom, inject} from "@angular/core";
import {Store, StoreModule} from "@ngrx/store";
import {editBuildSetReducer, FEATURE_EDIT_BUILD_SET} from "./state/edit-build-sets.reducer";
import {EffectsModule} from "@ngrx/effects";
import {EditBuildSetsEffects} from "./state/edit-build-sets.effects";
import {EditBuildSetPage} from "./edit-build-set.page";
import {Buildz} from "../core";
import * as EditBuildSetActions from "./state/edit-build-sets.actions";
import {EditBuildSetGuard} from "./edit-build-set.guard";

export const editBuildSetRoutes: Route[] = [
  {
    path: '',
    providers: [
      importProvidersFrom([
        StoreModule.forFeature(FEATURE_EDIT_BUILD_SET, editBuildSetReducer),
        EffectsModule.forFeature(EditBuildSetsEffects)
      ]),
      EditBuildSetGuard
    ],
    component: EditBuildSetPage,
    canActivate: [() => dispatchNewBuildSet()],
    children: [
      {path: ':build-set-name', component: EditBuildSetPage, canActivate: [EditBuildSetGuard]}
    ]
  }
]


function dispatchNewBuildSet() {
  inject(Store<Buildz>).dispatch(EditBuildSetActions.newBuildSet())
  return true;
}
