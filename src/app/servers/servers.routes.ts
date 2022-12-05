import {Route} from "@angular/router";
import {ServersPage} from "./servers.page";

export const serversRoutes: Route[] = [
  {
    path: '',
    component: ServersPage,
    providers: [
      // importProvidersFrom(
      //   StoreModule.forFeature(FEATURE_BUILDS, buildReducer),
      //   EffectsModule.forFeature(BuildsEffects)
      // )
    ]
  }
]
