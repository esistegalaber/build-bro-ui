import {EditableBuildTemplate, IBuildSetTemplate, IProject} from "../../core";

export const mapToEditableBuildTemplate = (project: IProject, buildSetTemplate: IBuildSetTemplate): EditableBuildTemplate => {
  const existingTemplate = buildSetTemplate.buildTemplates.find(bt => bt.project == project.name)
  if (!!existingTemplate) {
    return {
      project: project,
      branch: project.branches.find(b => b.name == existingTemplate.branch) || null,
      buildNumber: existingTemplate.buildNumber,
      labels: {},
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
