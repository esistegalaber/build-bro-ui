import {buildSetReducer, INITIAL_ENVIRONMENT_BUILDS} from './build-sets.reducer'
import {theBuildSet, theBuildSetTemplateNames, theSelectedBuildSetName} from './build-sets.selectors'
import * as BuildSetActions from './build-sets.actions'
import {build} from '../../../testing/data'

describe('buildSetReducer', () => {
  it('starts without names and without a selected build set', () => {
    expect(buildSetReducer(undefined, {type: '@@init'})).toEqual({names: [], selected: null, buildSet: {name: '', builds: {}}})
  })

  it('takes the loaded names', () => {
    const names = ['main', 'feature-test-stage-1']
    expect(buildSetReducer(INITIAL_ENVIRONMENT_BUILDS, BuildSetActions.buildSetNamesLoaded({names})).names).toBe(names)
  })

  it('remembers which build set is being loaded', () => {
    expect(buildSetReducer(INITIAL_ENVIRONMENT_BUILDS, BuildSetActions.loadBuildSetOf({templateName: 'main'})).selected).toBe('main')
  })

  it('takes the loaded build set', () => {
    const buildSet = {name: 'main', builds: {backend: build(9, 'backend', 'main', 9)}}
    expect(buildSetReducer(INITIAL_ENVIRONMENT_BUILDS, BuildSetActions.buildSetLoaded({buildSet})).buildSet).toBe(buildSet)
  })
})

describe('build set selectors', () => {
  const state = {names: ['main'], selected: 'main', buildSet: {name: 'main', builds: {}}}

  it('select the names, the build set and the selected name', () => {
    expect(theBuildSetTemplateNames.projector(state)).toBe(state.names)
    expect(theBuildSet.projector(state)).toBe(state.buildSet)
    expect(theSelectedBuildSetName.projector(state)).toBe('main')
  })
})
