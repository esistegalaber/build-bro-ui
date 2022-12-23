import {enableProdMode, importProvidersFrom} from '@angular/core';
import {environment} from './environments/environment';
import {AppComponent} from "./app/app.component";
import {StoreModule} from "@ngrx/store";
import {alertReducer} from "./app/core/state/alerts/alert.state";
import {statsReducer} from "./app/core/state/stats/stats.state";
import {navReducer} from "./app/core/state/nav/nav.reducer";
import {projectsReducer} from "./app/core/state/projects/project.reducer";
import {bootstrapApplication, BrowserModule} from "@angular/platform-browser";
import {provideRouter} from "@angular/router";
import {appRoutes} from "./app/app.routes";
import {EffectsModule} from "@ngrx/effects";
import {StatsEffects} from "./app/core/state/stats/stats.effects";
import {ProjectEffects} from "./app/core/state/projects/project.effects";
import {provideHttpClient} from "@angular/common/http";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {StoreDevtoolsModule} from "@ngrx/store-devtools";
import {serversReducer} from "./app/core/state/servers/server.reducer";
import {ServerEffects} from "./app/core/state/servers/server.effects";

if (environment.production) {
  enableProdMode();
}
bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom([
      BrowserModule,
      BrowserAnimationsModule,
      StoreModule.forRoot({
        'alert': alertReducer,
        'stats': statsReducer,
        'nav': navReducer,
        'projects': projectsReducer,
        'servers': serversReducer
      }),
      EffectsModule.forRoot([StatsEffects, ProjectEffects, ServerEffects]),
      StoreDevtoolsModule.instrument({maxAge: 25, logOnly: environment.production})
    ]),
    provideRouter(appRoutes),
    provideHttpClient()
  ]
}).catch(err => console.error(err));
