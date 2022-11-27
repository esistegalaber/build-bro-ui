import {Route} from "@angular/router";
import {BuildsPage} from "./builds.page";
import {StoreModule} from "@ngrx/store";
import {importProvidersFrom} from "@angular/core";
import {buildReducer} from "./state/builds.reducer";
import {EffectsModule} from "@ngrx/effects";
import {BuildsEffects} from "./state/builds.effects";

export const routes: Route[] = [
  {
    path: '',
    component: BuildsPage,
    providers: [
      importProvidersFrom(
        StoreModule.forFeature('builds', buildReducer),
        EffectsModule.forFeature(BuildsEffects)
      )]
  }
]
