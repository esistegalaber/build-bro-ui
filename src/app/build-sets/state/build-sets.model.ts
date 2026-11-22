import {IBuildSet, IBuildSetTemplate} from "../../core";

export const FEATURE_BUILD_SETS = 'build-sets'

export interface BuildSetsState {
  /** All build set templates, with their projects (for the list and its summaries). */
  templates: IBuildSetTemplate[]
  /** The name of the selected build set, or null. */
  selected: string | null
  /** The builds the selected build set resolves to. */
  buildSet: IBuildSet
}

/** What the list shows about a build set. */
export interface BuildSetSummary {
  name: string
  projects: number
  pinned: number
}

/** Summarizes a build set template: how many projects it has, and how many of them are pinned to a build number. */
export function toBuildSetSummary(template: IBuildSetTemplate): BuildSetSummary {
  return {
    name: template.name,
    projects: template.buildTemplates.length,
    pinned: template.buildTemplates.filter((bt) => bt.buildNumber !== null && bt.buildNumber !== undefined).length
  }
}
