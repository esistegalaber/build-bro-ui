import {projectsReducer} from './project.reducer'
import * as ProjectActions from './project.actions'
import {branch, someProjects} from '../../../../testing/data'
import {ProjectsState} from '../model'

describe('projectsReducer', () => {
  const loaded = (): ProjectsState => ({includeInactiveProjects: false, projects: someProjects()})

  it('starts without projects, hiding inactive ones', () => {
    expect(projectsReducer(undefined, {type: '@@init'})).toEqual({includeInactiveProjects: false, projects: []})
  })

  it('takes the loaded projects', () => {
    const projects = someProjects()
    expect(projectsReducer(undefined, ProjectActions.projectsLoaded({projects})).projects).toEqual(projects)
  })

  it('replaces an updated branch in its project, without touching the old state', () => {
    const state = loaded()
    const next = projectsReducer(state, ProjectActions.branchUpdated({branch: branch(2, 'next', 1, false)}))
    expect(next.projects[0].branches[1]).toEqual(branch(2, 'next', 1, false))
    expect(next.projects[0].branches[0]).toEqual(state.projects[0].branches[0])
    expect(state.projects[0].branches[1].active).toBe(true)
  })

  it('ignores a branch of an unknown project or an unknown branch', () => {
    const state = loaded()
    expect(projectsReducer(state, ProjectActions.branchUpdated({branch: branch(2, 'next', 99)}))).toEqual(state)
    expect(projectsReducer(state, ProjectActions.branchUpdated({branch: branch(99, 'new', 1)}))).toEqual(state)
  })

  it('toggles whether inactive projects are shown', () => {
    const shown = projectsReducer(loaded(), ProjectActions.toggleInactiveData())
    expect(shown.includeInactiveProjects).toBe(true)
    expect(projectsReducer(shown, ProjectActions.toggleInactiveData()).includeInactiveProjects).toBe(false)
  })
})
