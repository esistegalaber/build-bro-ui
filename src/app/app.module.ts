import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {FaIconLibrary} from "@fortawesome/angular-fontawesome";
import {StoreDevtoolsModule} from "@ngrx/store-devtools";
import {environment} from "../environments/environment";
import {Store, StoreModule} from "@ngrx/store";
import {Buildz} from "./core";
import {faBackspace, faBars, faCheck, faCogs, faEye, faEyeSlash, faHammer, faLock, faPlus, faSave, faScrewdriverWrench, faSync, faToggleOff, faToggleOn, faUndo, faUnsorted} from "@fortawesome/free-solid-svg-icons";
import {EffectsModule} from "@ngrx/effects";
import {StatsEffects} from "./core/state/stats/stats.effects";
import * as BuildSearchActions from "./builds/state/builds.actions";
import {SharedModule} from "./shared/shared.module";
import {alertReducer} from "./core/state/alerts/alert.state";
import {statsReducer} from "./core/state/stats/stats.state";

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    SharedModule,
    AppRoutingModule,
    StoreModule.forRoot({
      'alert': alertReducer,
      'stats': statsReducer
    }),
    // StoreModule.forFeature(alertFeature),
    // StoreModule.forFeature(statsFeature),
    // StoreModule.forFeature(buildsFeature),
    EffectsModule.forRoot([
      StatsEffects
    ]),
    StoreDevtoolsModule.instrument({maxAge: 25, logOnly: environment.production}),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(library: FaIconLibrary, store: Store<Buildz>) {
    store.dispatch(BuildSearchActions.loadAvailableBuildSearchData())
    // store.dispatch(loadBuildStats())
    // store.dispatch(loadKnownEnvironments())
    // store.dispatch(LOAD_KNOWN_SERVERS())
    library.addIcons(
      faCogs,
      faSave,
      faToggleOn,
      faToggleOff,
      faPlus,
      faBackspace,
      faCheck,
      faUndo,
      faSync,
      faEye,
      faEyeSlash,
      faLock,
      faHammer,
      faScrewdriverWrench,
      faBars,
      faUnsorted
    )
  }
}
