import {Route} from "@angular/router";
import {provideState} from "@ngrx/store";
import {provideEffects} from "@ngrx/effects";
import {HomePage} from "./home.page";
import {FEATURE_HOME, homeReducer} from "./state/home.reducer";
import {HomeEffects} from "./state/home.effects";

export const homeRoutes: Route[] = [
  {
    path: '',
    component: HomePage,
    providers: [
      provideState(FEATURE_HOME, homeReducer),
      provideEffects(HomeEffects)
    ]
  }
]
