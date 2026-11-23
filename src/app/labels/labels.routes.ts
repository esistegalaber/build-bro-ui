import {Route} from "@angular/router";
import {provideState} from "@ngrx/store";
import {provideEffects} from "@ngrx/effects";
import {LabelsPage} from "./labels.page";
import {FEATURE_LABEL_ADMIN, labelAdminReducer} from "./state/labels-admin.reducer";
import {LabelAdminEffects} from "./state/labels-admin.effects";

export const labelsRoutes: Route[] = [
  {
    path: '',
    component: LabelsPage,
    providers: [
      provideState(FEATURE_LABEL_ADMIN, labelAdminReducer),
      provideEffects(LabelAdminEffects)
    ]
  }
]
