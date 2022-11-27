import {IBuildSet} from "../../core";

export const FEATURE_BUILD_SETS = 'build-sets'
export interface BuildSetsState{
  names: string[]
  buildSet: IBuildSet
}
