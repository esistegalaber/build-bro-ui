import {EditableBuildTemplate, IBuildSetTemplate, IProject} from "../../core";

export const mapToEditableBuildTemplate = (project: IProject, buildSetTemplate: IBuildSetTemplate): EditableBuildTemplate => {
  const existingTemplate = buildSetTemplate.buildTemplates.find(bt => bt.project == project.name)
  if (!!existingTemplate) {
    return {
      project: project,
      branch: project.branches.find(b => b.name == existingTemplate.branch) || null,
      buildNumber: existingTemplate.buildNumber,
      labels: {...existingTemplate.labels},
      projectSelected: true
    }
  } else {
    return {
      project: project,
      branch: null,
      buildNumber: null,
      labels: {},
      projectSelected: false
    }
  }
}

/** Shows a label filter as text: `{a: '1', b: '2'}` becomes `a=1, b=2`. */
export const formatLabels = (labels: { [key: string]: string } | null | undefined): string =>
  Object.entries(labels ?? {}).map(([key, value]) => `${key}=${value}`).join(', ')

/** Reads a label filter typed as `key=value, key=value`. Parts without a key or a value are ignored. */
export const parseLabels = (text: string): { [key: string]: string } => {
  const labels: { [key: string]: string } = {}
  for (const part of text.split(',')) {
    const separator = part.indexOf('=')
    const key = part.substring(0, separator).trim()
    const value = part.substring(separator + 1).trim()
    if (separator > 0 && key && value) {
      labels[key] = value
    }
  }
  return labels
}
