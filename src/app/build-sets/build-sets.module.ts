import {inject, NgModule} from "@angular/core";
import {SharedModule} from "../shared/shared.module";
import {Store, StoreModule} from "@ngrx/store";
import {EffectsModule} from "@ngrx/effects";
import {RouterModule} from "@angular/router";
import {buildSetReducer} from "./state/build-sets.reducer";
import {BuildSetsEffects} from "./state/build-sets.effects";
import {BuildSetsPage} from "./build-sets.page";
import {Buildz} from "../core";
import {loadBuildSetNames, newBuildSet} from "./state/build-sets.actions";
import {EditBuildSetPage} from "./edit-build-set.page";

@NgModule({
  imports: [
    SharedModule,
    StoreModule.forFeature('buildSets', buildSetReducer),
    EffectsModule.forFeature([BuildSetsEffects]),
    RouterModule.forChild([
      {path: '', component: BuildSetsPage},
      {
        path: 'new', component: EditBuildSetPage, canActivate: [() => {
          dispatchNewBuildSet()
        }]
      }
    ])
  ],
  declarations: [
    BuildSetsPage,
    EditBuildSetPage
  ]

})
export class BuildSetsModule {

  constructor(private store: Store<Buildz>) {
    this.store.dispatch(loadBuildSetNames())
  }
}

function dispatchNewBuildSet() {
  inject(Store<Buildz>).dispatch(newBuildSet())
  return true;
}
