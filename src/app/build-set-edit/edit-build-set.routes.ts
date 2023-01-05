import {Route} from "@angular/router";
import {importProvidersFrom} from "@angular/core";
import {StoreModule} from "@ngrx/store";
import {editBuildSetReducer, FEATURE_EDIT_BUILD_SET} from "./state/edit-build-sets.reducer";
import {EffectsModule} from "@ngrx/effects";
import {EditBuildSetsEffects} from "./state/edit-build-sets.effects";
import {EditBuildSetPage} from "./edit-build-set.page";
import {EditBuildSetGuard} from "./guards/edit-build-set.guard";
import {NewBuildSetGuard} from "./guards/new-build-set.guard";
import {CloneBuildSetGuard} from "./guards/clone-build-set.guard";

export const editBuildSetRoutes: Route[] = [
  {
    path: '',
    providers: [
      importProvidersFrom([
        StoreModule.forFeature(FEATURE_EDIT_BUILD_SET, editBuildSetReducer),
        EffectsModule.forFeature(EditBuildSetsEffects)
      ]),
      NewBuildSetGuard,
      EditBuildSetGuard,
      CloneBuildSetGuard
    ],
    children: [
      {path: 'new', component: EditBuildSetPage, canActivate: [NewBuildSetGuard]},
      {path: ':build-set-name', component: EditBuildSetPage, canActivate: [EditBuildSetGuard]},
      {path: 'clone/:build-set-name', component: EditBuildSetPage, canActivate: [CloneBuildSetGuard]},
      {path: '**', redirectTo: 'new'}
    ]
  }
]
