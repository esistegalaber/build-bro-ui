import {IBranch, IBuild, IProject, IServer} from '../app/core'

export function branch(id: number, name: string, projectId: number, active = true): IBranch {
  return {id, name, projectId, active}
}

export function project(id: number, name: string, branches: IBranch[], active = true): IProject {
  return {id, name, active, branches}
}

/** Two active projects (one with an inactive branch) and an inactive one. */
export function someProjects(): IProject[] {
  return [
    project(1, 'backend', [branch(1, 'main', 1), branch(2, 'next', 1), branch(3, 'merged-feature', 1, false)]),
    project(2, 'frontend', [branch(4, 'main', 2)]),
    project(3, 'abandoned', [branch(5, 'main', 3)], false)
  ]
}

export function build(id: number, projectName: string, branchName: string, buildNumber: number): IBuild {
  return {id, project: projectName, branch: branchName, buildNumber, labels: []}
}

export function someServers(): IServer[] {
  return [
    {id: 1, name: 'testserver', nickName: 'Tester', description: 'Main Testing Server'},
    {id: 2, name: 'staging', nickName: 'Company Staging', description: 'Main Staging Server'}
  ]
}
