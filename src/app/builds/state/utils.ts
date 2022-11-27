import {IBuild, IBuildDataTreeNode, IBuildLabel} from "../../core";

export function toBuildNode(build: IBuild): IBuildDataTreeNode {
  const toReturn = {
    build: build,
    name: `${build.project}::${build.branch}::${build.buildNumber}`,
    children: build.labels.map(toBuildLabelNode)
  }
  return toReturn
}

function toBuildLabelNode(label: IBuildLabel): IBuildDataTreeNode {
  if (label.key.indexOf(".") > 0) {

  }
  return {
    label: label,
    name: `${label.key}::${label.value}`,
    children: []
  }
}
