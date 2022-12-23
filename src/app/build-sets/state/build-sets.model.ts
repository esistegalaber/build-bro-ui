import {IBuildSet} from "../../core";

export const FEATURE_BUILD_SETS = 'build-sets'

export interface BuildSetsState {
  names: string[]
  selected: string | null
  buildSet: IBuildSet
}
