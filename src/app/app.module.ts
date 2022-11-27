import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {StoreDevtoolsModule} from "@ngrx/store-devtools";
import {environment} from "../environments/environment";
import {Store, StoreModule} from "@ngrx/store";
import {Buildz} from "./core";
import {EffectsModule} from "@ngrx/effects";
import {StatsEffects} from "./core/state/stats/stats.effects";
import * as ProjectActions from "./core/state/projects/project.actions";
import {alertReducer} from "./core/state/alerts/alert.state";
import {statsReducer} from "./core/state/stats/stats.state";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {navReducer} from "./core/state/nav/nav.reducer";
import {ProjectEffects} from "./core/state/projects/project.effects";
import {projectsReducer} from "./core/state/projects/project.reducer";
import {BuildBroToolbar} from "./shared/ui/nav/build-bro.toolbar";
import {SidenavPanel} from "./shared/ui/nav/sidenav.panel";
import {AlertPanel} from "./shared/ui/alert.panel";
import {HttpClient, HttpClientModule} from "@angular/common/http";

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    BuildBroToolbar,
    SidenavPanel,
    AlertPanel,
    HttpClientModule,
    StoreModule.forRoot({
      'alert': alertReducer,
      'stats': statsReducer,
      'nav': navReducer,
      'projects': projectsReducer
    }),
    // StoreModule.forFeature(alertFeature),
    // StoreModule.forFeature(statsFeature),
    // StoreModule.forFeature(buildsFeature),
    EffectsModule.forRoot([
      StatsEffects,
      ProjectEffects
    ]),
    StoreDevtoolsModule.instrument({maxAge: 25, logOnly: environment.production})
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(store: Store<Buildz>) {
    store.dispatch(ProjectActions.loadProjects())
    // store.dispatch(loadBuildStats())
    // store.dispatch(loadKnownEnvironments())
    // store.dispatch(LOAD_KNOWN_SERVERS())
    // library.addIcons(
    //   faCogs,
    //   faSave,
    //   faToggleOn,
    //   faToggleOff,
    //   faPlus,
    //   faBackspace,
    //   faCheck,
    //   faUndo,
    //   faSync,
    //   faEye,
    //   faEyeSlash,
    //   faLock,
    //   faHammer,
    //   faScrewdriverWrench,
    //   faBars,
    //   faUnsorted
    // )
  }
}
