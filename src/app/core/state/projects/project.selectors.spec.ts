import {allActiveProjects, allProjects, includeInactiveData, projectsData} from './project.selectors'
import {someProjects} from '../../../../testing/data'
import {ProjectsState} from '../model'

describe('project selectors', () => {
  const state = (includeInactiveProjects = false): ProjectsState => ({includeInactiveProjects, projects: someProjects()})

  it('tell whether inactive projects are shown', () => {
    expect(includeInactiveData.projector(state(true))).toBe(true)
  })

  it('select all projects as they are', () => {
    const s = state()
    expect(allProjects.projector(s)).toBe(s.projects)
  })

  it('select only active projects, each with only its active branches', () => {
    const s = state()
    const active = allActiveProjects.projector(s)
    expect(active.map((p) => p.name)).toEqual(['backend', 'frontend'])
    expect(active[0].branches.map((b) => b.name)).toEqual(['main', 'next'])
    // the store state itself keeps the inactive branch
    expect(s.projects[0].branches).toHaveLength(3)
  })

  it('select all or only active projects depending on the toggle', () => {
    const all = someProjects()
    const active = all.slice(0, 2)
    expect(projectsData.projector(state(false), all, active)).toBe(active)
    expect(projectsData.projector(state(true), all, active)).toBe(all)
  })
})
