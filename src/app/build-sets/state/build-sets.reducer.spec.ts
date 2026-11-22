import {buildSetReducer, INITIAL_BUILD_SETS_STATE} from './build-sets.reducer'
import {theBuildSet, theBuildSetSummaries, theSelectedBuildSetName, theSelectedSummary} from './build-sets.selectors'
import * as BuildSetActions from './build-sets.actions'
import {BuildSetsState} from './build-sets.model'
import {build} from '../../../testing/data'
import {IBuildSetTemplate} from '../../core'

const templates = (): IBuildSetTemplate[] => [
  {
    id: 1, name: 'main', buildTemplates: [
      {project: 'backend', branch: 'main', buildNumber: 9, labels: {}},
      {project: 'frontend', branch: 'main', buildNumber: null, labels: {}}
    ]
  },
  {id: 2, name: 'feature-test-stage-1', buildTemplates: []}
]

describe('buildSetReducer', () => {
  const selectedMain = (): BuildSetsState => ({
    templates: templates(), selected: 'main', buildSet: {name: 'main', builds: {backend: build(9, 'backend', 'main', 9)}}
  })

  it('starts without build sets and without a selection', () => {
    expect(buildSetReducer(undefined, {type: '@@init'})).toEqual({templates: [], selected: null, buildSet: {name: '', builds: {}}})
  })

  it('takes the loaded build sets', () => {
    const loaded = templates()
    expect(buildSetReducer(INITIAL_BUILD_SETS_STATE, BuildSetActions.buildSetTemplatesLoaded({templates: loaded})).templates).toBe(loaded)
  })

  it('remembers which build set is being loaded', () => {
    expect(buildSetReducer(INITIAL_BUILD_SETS_STATE, BuildSetActions.loadBuildSetOf({templateName: 'main'})).selected).toBe('main')
  })

  it('takes the loaded build set', () => {
    const buildSet = {name: 'main', builds: {backend: build(9, 'backend', 'main', 9)}}
    expect(buildSetReducer(INITIAL_BUILD_SETS_STATE, BuildSetActions.buildSetLoaded({buildSet})).buildSet).toBe(buildSet)
  })

  it('drops a deleted build set and clears the selection when it was selected', () => {
    const next = buildSetReducer(selectedMain(), BuildSetActions.buildSetTemplateDeleted({name: 'main'}))
    expect(next.templates.map((t) => t.name)).toEqual(['feature-test-stage-1'])
    expect(next.selected).toBeNull()
    expect(next.buildSet).toEqual({name: '', builds: {}})
  })

  it('keeps the selection when another build set was deleted', () => {
    const next = buildSetReducer(selectedMain(), BuildSetActions.buildSetTemplateDeleted({name: 'feature-test-stage-1'}))
    expect(next.templates.map((t) => t.name)).toEqual(['main'])
    expect(next.selected).toBe('main')
    expect(next.buildSet.name).toBe('main')
  })
})

describe('build set selectors', () => {
  const state: BuildSetsState = {templates: templates(), selected: 'main', buildSet: {name: 'main', builds: {}}}
  const summaries = [{name: 'main', projects: 2, pinned: 1}, {name: 'feature-test-stage-1', projects: 0, pinned: 0}]

  it('summarize each build set: its projects and how many are pinned', () => {
    expect(theBuildSetSummaries.projector(state)).toEqual(summaries)
  })

  it('select the build set, the selected name and its summary', () => {
    expect(theBuildSet.projector(state)).toBe(state.buildSet)
    expect(theSelectedBuildSetName.projector(state)).toBe('main')
    expect(theSelectedSummary.projector(summaries, 'main')).toEqual(summaries[0])
    expect(theSelectedSummary.projector(summaries, null)).toBeNull()
  })
})
