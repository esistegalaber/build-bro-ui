import {IBuildSet, IBuildSetTemplate} from "../../core";

export const FEATURE_EDIT_BUILD_SET = 'edit-build-set'

export interface EditBuildSetState {
  theTemplate: IBuildSetTemplate
  buildSet: IBuildSet
}
