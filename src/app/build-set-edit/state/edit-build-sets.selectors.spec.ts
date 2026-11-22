import {
  theBuilds,
  theBuildTemplates,
  theCurrentBuildTemplatesForVerification,
  theEditableBuildTemplates,
  theEditableTemplate,
  theTemplate
} from './edit-build-sets.selectors'
import {EditBuildSetState, INITIAL_STATE} from './edit-build-sets.reducer'
import {formatLabels, mapToEditableBuildTemplate, parseLabels} from './utils'
import {build, someProjects} from '../../../testing/data'

describe('edit build set selectors', () => {
  const state: EditBuildSetState = {
    theTemplate: {
      id: 1, name: 'main', buildTemplates: [
        {id: 1, project: 'backend', branch: 'main', buildNumber: 9, labels: {}},
        {id: 2, project: 'frontend', branch: null, buildNumber: null, labels: {}}
      ]
    },
    buildSet: {name: 'verification-result', builds: {backend: build(9, 'backend', 'main', 9)}}
  }
  const activeProjects = someProjects().slice(0, 2)

  it('select the template and its build templates', () => {
    expect(theTemplate.projector(state)).toBe(state.theTemplate)
    expect(theBuildTemplates.projector(state.theTemplate)).toBe(state.theTemplate.buildTemplates)
  })

  it('select the name and the projects that are part of the template', () => {
    expect(theEditableTemplate.projector(state, someProjects())).toEqual({
      name: 'main', projects: activeProjects
    })
  })

  it('select one editable template per active project', () => {
    const editable = theEditableBuildTemplates.projector(state.theTemplate, activeProjects)
    expect(editable.map((e) => [e.project.name, e.projectSelected])).toEqual([['backend', true], ['frontend', true]])
  })

  it('select the verified builds as a list', () => {
    expect(theBuilds.projector(state)).toEqual([build(9, 'backend', 'main', 9)])
    expect(theBuilds.projector(INITIAL_STATE)).toEqual([])
  })

  it('select what the API needs to verify the template', () => {
    expect(theCurrentBuildTemplatesForVerification.projector(state)).toEqual([
      {project: 'backend', branch: 'main', buildNumber: 9},
      {project: 'frontend', branch: null, buildNumber: null}
    ])
  })
})

describe('mapToEditableBuildTemplate', () => {
  const [backend] = someProjects()

  it('marks a project of the template as selected, with its branch object and build number', () => {
    const template = {name: 'main', buildTemplates: [{project: 'backend', branch: 'next', buildNumber: 9, labels: {}}]}
    expect(mapToEditableBuildTemplate(backend, template)).toEqual({
      project: backend, branch: backend.branches[1], buildNumber: 9, labels: {}, projectSelected: true
    })
  })

  it('keeps the label filter of the template', () => {
    const template = {name: 'main', buildTemplates: [{project: 'backend', branch: 'main', buildNumber: null, labels: {a: '1'}}]}
    const editable = mapToEditableBuildTemplate(backend, template)
    expect(editable.labels).toEqual({a: '1'})
    expect(editable.labels).not.toBe(template.buildTemplates[0].labels)
  })

  it('has no branch when the template names a branch the project does not have (any more)', () => {
    const template = {name: 'main', buildTemplates: [{project: 'backend', branch: 'gone', buildNumber: null, labels: {}}]}
    expect(mapToEditableBuildTemplate(backend, template).branch).toBeNull()
  })

  it('marks a project that is not in the template as not selected', () => {
    expect(mapToEditableBuildTemplate(backend, {name: 'new', buildTemplates: []})).toEqual({
      project: backend, branch: null, buildNumber: null, labels: {}, projectSelected: false
    })
  })
})

describe('label filter text', () => {
  it('formats labels as key=value pairs', () => {
    expect(formatLabels({'integration-test': 'ok', 'release.name': 'Analog-Amoeba'})).toBe('integration-test=ok, release.name=Analog-Amoeba')
    expect(formatLabels({})).toBe('')
    expect(formatLabels(null)).toBe('')
  })

  it('reads key=value pairs, trimming spaces and skipping incomplete parts', () => {
    expect(parseLabels(' integration-test = ok ,release.name=Analog-Amoeba')).toEqual({'integration-test': 'ok', 'release.name': 'Analog-Amoeba'})
    expect(parseLabels('no-value=, =no-key, nothing, , a=b=c')).toEqual({a: 'b=c'})
    expect(parseLabels('')).toEqual({})
  })
})
