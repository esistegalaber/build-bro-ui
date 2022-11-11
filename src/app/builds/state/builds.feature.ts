import {createFeature} from "@ngrx/store";
import {buildReducer} from "./builds.state";

export const buildsFeature = createFeature({
  name: 'builds',
  reducer: buildReducer
})
