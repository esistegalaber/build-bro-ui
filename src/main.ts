import {enableProdMode, provideZonelessChangeDetection} from '@angular/core';
import {environment} from './environments/environment';
import {AppComponent} from "./app/app.component";
import {provideStore} from "@ngrx/store";
import {alertReducer} from "./app/core/state/alerts/alert.state";
import {statsReducer} from "./app/core/state/stats/stats.state";
import {navReducer} from "./app/core/state/nav/nav.reducer";
import {projectsReducer} from "./app/core/state/projects/project.reducer";
import {bootstrapApplication} from "@angular/platform-browser";
import {provideRouter} from "@angular/router";
import {appRoutes} from "./app/app.routes";
import {provideEffects} from "@ngrx/effects";
import {StatsEffects} from "./app/core/state/stats/stats.effects";
import {ProjectEffects} from "./app/core/state/projects/project.effects";
import {provideHttpClient, withXhr} from "@angular/common/http";
import {provideStoreDevtools} from "@ngrx/store-devtools";
import {serversReducer} from "./app/core/state/servers/server.reducer";
import {ServerEffects} from "./app/core/state/servers/server.effects";

if (environment.production) {
  enableProdMode();
}
bootstrapApplication(AppComponent, {
  providers: [
    provideZonelessChangeDetection(),
    provideStore({
      'alert': alertReducer,
      'stats': statsReducer,
      'nav': navReducer,
      'projects': projectsReducer,
      'servers': serversReducer
    }),
    provideEffects(StatsEffects, ProjectEffects, ServerEffects),
    provideStoreDevtools({maxAge: 25, logOnly: environment.production}),
    provideRouter(appRoutes),
    provideHttpClient(withXhr())
  ]
}).catch(err => console.error(err));
