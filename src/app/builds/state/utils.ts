import {IBuild, IBuildDataTreeNode, IBuildLabel} from "../../core";
import {flatten} from "flat";

export function toBuildNode(build: IBuild): IBuildDataTreeNode {
  const toReturn = {
    build: build,
    name: `${build.project}::${build.branch}::${build.buildNumber}`,
    children: []
  }
  mapLabels(build.labels, toReturn)
  return toReturn
}

function toBuildLabelNode(label: IBuildLabel): IBuildDataTreeNode {
  if(label.key.indexOf(".") > 0){

  }
  return {
    label: label,
    name: `${label.key}::${label.value}`,
    children: []
  }
}

function mapLabels(labels: IBuildLabel[], node: IBuildDataTreeNode) {
  const flat: any = {}
  labels.forEach((label: IBuildLabel) => {
    flat[label.key] = label.value
    // flat[label.key] = label
  })
  const deep = flatten.unflatten(flat)
  treeNodesOf(deep, node)
}

function treeNodesOf(theObject: any, node: IBuildDataTreeNode) {
  Object.keys(theObject).forEach((key) => {
    if (typeof theObject[key] === 'string') {
      const newNode: IBuildDataTreeNode = {
        name: `${key} - ${theObject[key]}`,
        children: [],
      }
      node.children.push(newNode)
    }
    if (typeof theObject[key] == 'object') {
      const newNode = {
        name: `${key}`,
        children: [],
      }
      node.children.push(newNode)
      treeNodesOf(theObject[key], newNode)
    }
  });
}
