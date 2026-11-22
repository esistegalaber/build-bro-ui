import {editBuildSetReducer, EditBuildSetState, INITIAL_STATE} from './edit-build-sets.reducer'
import * as EditActions from './edit-build-sets.actions'
import {build, someProjects} from '../../../testing/data'
import {IBuildSetTemplate} from '../../core'

describe('editBuildSetReducer', () => {
  const main = (): IBuildSetTemplate => ({
    id: 1, name: 'main', buildTemplates: [
      {id: 1, project: 'backend', branch: 'main', buildNumber: 9, labels: {}},
      {id: 2, project: 'frontend', branch: 'main', buildNumber: null, labels: {}}
    ]
  })
  const withMain = (): EditBuildSetState => ({...INITIAL_STATE, theTemplate: main()})
  const [backend, frontend] = someProjects()

  it('starts with an empty, unnamed template', () => {
    expect(editBuildSetReducer(undefined, {type: '@@init'})).toEqual(INITIAL_STATE)
  })

  it('takes a loaded template', () => {
    const theTemplate = main()
    expect(editBuildSetReducer(INITIAL_STATE, EditActions.buildSetTemplateLoaded({theTemplate})).theTemplate).toBe(theTemplate)
  })

  it('turns a template to clone into a new, unsaved one named CLONE-OF-…', () => {
    const theTemplate = main()
    const next = editBuildSetReducer(INITIAL_STATE, EditActions.buildSetTemplateToCloneLoaded({theTemplate}))
    expect(next.theTemplate.id).toBeNull()
    expect(next.theTemplate.name).toBe('CLONE-OF-main')
    expect(next.theTemplate.buildTemplates).toEqual(theTemplate.buildTemplates)
    expect(theTemplate.name).toBe('main')
  })

  it('takes the verified build set', () => {
    const buildSet = {name: 'verification-result', builds: {backend: build(9, 'backend', 'main', 9)}}
    expect(editBuildSetReducer(INITIAL_STATE, EditActions.buildSetLoaded({buildSet})).buildSet).toBe(buildSet)
  })

  it('starts over for a new build set', () => {
    expect(editBuildSetReducer(withMain(), EditActions.newBuildSet())).toEqual(INITIAL_STATE)
  })

  it('adds a project with no branch, no labels and the latest build', () => {
    const state = {...INITIAL_STATE, theTemplate: {name: 'new', buildTemplates: []}}
    const next = editBuildSetReducer(state, EditActions.projectAdded({project: backend}))
    expect(next.theTemplate.buildTemplates).toEqual([{project: 'backend', branch: null, labels: {}, buildNumber: null}])
    expect(state.theTemplate.buildTemplates).toEqual([])
  })

  it('removes a project', () => {
    const state = withMain()
    const next = editBuildSetReducer(state, EditActions.projectRemoved({project: frontend}))
    expect(next.theTemplate.buildTemplates.map((bt) => bt.project)).toEqual(['backend'])
    expect(state.theTemplate.buildTemplates).toHaveLength(2)
  })

  it('updates the branch and build number of a project', () => {
    const state = withMain()
    const buildTemplate = {project: backend, projectSelected: true, branch: backend.branches[1], buildNumber: 7, labels: {}}
    const next = editBuildSetReducer(state, EditActions.buildTemplateUpdated({buildTemplate}))
    expect(next.theTemplate.buildTemplates[0]).toEqual({id: 1, project: 'backend', branch: 'next', buildNumber: 7, labels: {}})
    expect(state.theTemplate.buildTemplates[0].branch).toBe('main')
  })

  it('clears the branch when none is chosen, and ignores projects that are not in the template', () => {
    const state = withMain()
    const noBranch = {project: backend, projectSelected: true, branch: null, buildNumber: null, labels: {}}
    expect(editBuildSetReducer(state, EditActions.buildTemplateUpdated({buildTemplate: noBranch}))
      .theTemplate.buildTemplates[0].branch).toBeNull()
    const unknown = {...noBranch, project: someProjects()[2]}
    expect(editBuildSetReducer(state, EditActions.buildTemplateUpdated({buildTemplate: unknown})).theTemplate)
      .toEqual(state.theTemplate)
  })

  it('takes the name to save with', () => {
    const state = withMain()
    expect(editBuildSetReducer(state, EditActions.saveWith({name: 'renamed'})).theTemplate.name).toBe('renamed')
    expect(state.theTemplate.name).toBe('main')
  })
})
