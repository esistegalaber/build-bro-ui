import {NgModule} from "@angular/core";
import {SharedModule} from "../shared/shared.module";
import {RouterModule} from "@angular/router";
import {BuildsPage} from "./builds.page";
import {BuildSearchForm} from "./ui/build-search.form";
import {Store, StoreModule} from "@ngrx/store";
import {buildReducer} from "./state/builds.state";
import {EffectsModule} from "@ngrx/effects";
import {BuildsEffects} from "./state/builds.effects";
import {Buildz} from "../core";
import {loadAvailableBuildSearchData} from "./state/builds.actions";

@NgModule({
  imports: [
    SharedModule,
    StoreModule.forFeature('builds', buildReducer),
    EffectsModule.forFeature([BuildsEffects]),
    RouterModule.forChild([
      {path: '', component: BuildsPage}
    ])
  ],
  declarations: [
    BuildsPage,
    BuildSearchForm
  ]
})
export class BuildsModule {

  constructor(private store: Store<Buildz>) {
    this.store.dispatch(loadAvailableBuildSearchData())
  }
}
