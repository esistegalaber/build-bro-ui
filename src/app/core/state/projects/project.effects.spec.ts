import {ProjectEffects} from './project.effects'
import * as ProjectActions from './project.actions'
import {backendErrorOccurred} from '../alerts/alert.actions'
import {API_ERROR, collect, setUpEffects} from '../../../../testing/effects'
import {branch, someProjects} from '../../../../testing/data'

describe('ProjectEffects', () => {
  it('loads all projects', () => {
    const {effects, actions$, http} = setUpEffects(ProjectEffects)
    const emitted = collect(effects.loadProjects$)
    actions$.next(ProjectActions.loadProjects())
    http.expectOne({method: 'GET', url: '/api/v1/projects'}).flush(someProjects())
    expect(emitted).toEqual([ProjectActions.projectsLoaded({projects: someProjects()})])
    http.verify()
  })

  it('reports a failed load', () => {
    const {effects, actions$, http} = setUpEffects(ProjectEffects)
    const emitted = collect(effects.loadProjects$)
    actions$.next(ProjectActions.loadProjects())
    http.expectOne('/api/v1/projects').flush(API_ERROR, {status: 500, statusText: 'Server Error'})
    expect(emitted.map((a) => a.type)).toEqual([backendErrorOccurred.type])
  })

  it('activates a branch', () => {
    const {effects, actions$, http} = setUpEffects(ProjectEffects)
    const emitted = collect(effects.activateBranch$)
    actions$.next(ProjectActions.activateBranch({branchId: 3}))
    http.expectOne({method: 'POST', url: '/api/v1/projects/branch-active/3'}).flush(branch(3, 'merged-feature', 1))
    expect(emitted).toEqual([ProjectActions.branchUpdated({branch: branch(3, 'merged-feature', 1)})])
  })

  it('deactivates a branch', () => {
    const {effects, actions$, http} = setUpEffects(ProjectEffects)
    const emitted = collect(effects.deActivateBranch$)
    actions$.next(ProjectActions.deactivateBranch({branchId: 2}))
    http.expectOne({method: 'POST', url: '/api/v1/projects/branch-inactive/2'}).flush(branch(2, 'next', 1, false))
    expect(emitted).toEqual([ProjectActions.branchUpdated({branch: branch(2, 'next', 1, false)})])
  })

  it('reports a failed branch update', () => {
    const {effects, actions$, http} = setUpEffects(ProjectEffects)
    const emitted = collect(effects.activateBranch$)
    actions$.next(ProjectActions.activateBranch({branchId: 99}))
    http.expectOne('/api/v1/projects/branch-active/99').flush(API_ERROR, {status: 404, statusText: 'Not Found'})
    expect(emitted.map((a) => a.type)).toEqual([backendErrorOccurred.type])
  })
})
