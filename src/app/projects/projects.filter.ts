import {IProject} from '../core'

/**
 * The projects matching a search: a project whose name matches keeps all its branches,
 * otherwise only its matching branches are kept. Case-insensitive; an empty search matches everything.
 */
export function filterProjects(projects: IProject[], search: string): IProject[] {
  const query = search.trim().toLowerCase()
  if (!query) return projects
  return projects.flatMap((project) => {
    if (project.name.toLowerCase().includes(query)) return [project]
    const branches = project.branches.filter((b) => b.name.toLowerCase().includes(query))
    return branches.length > 0 ? [{...project, branches}] : []
  })
}
