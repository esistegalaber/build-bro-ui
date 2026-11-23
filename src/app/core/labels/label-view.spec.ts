import {definitionOf, labelView, styleClass} from './label-view'
import {aBooleanDefinition, someLabelDefinitions} from '../../../testing/data'

describe('labelView', () => {
  const [integrationTest, jenkinsBuild, revision] = someLabelDefinitions()

  it('shows a label without a definition as before: its key, plain text, no style', () => {
    expect(labelView('part-of-build-set', 'main')).toEqual({name: 'part-of-build-set', title: null, style: null, kind: 'text', truthy: false})
  })

  it('uses the display name, with key and description as the tooltip', () => {
    const view = labelView('integration-test', 'ok', integrationTest)
    expect(view.name).toBe('Integration test')
    expect(view.title).toBe('integration-test · Outcome of the integration test suite')
  })

  it('takes the key as the name without a display name, and has no tooltip without a description', () => {
    expect(labelView('released', 'true', aBooleanDefinition())).toMatchObject({name: 'released', title: null})
  })

  it.each([
    ['ok', 'SUCCESS'],
    ['OK', 'SUCCESS'],
    ['broken', 'ERROR'],
    ['flaky', null]
  ])('styles %s of an enum by its value style, ignoring case: %s', (value, style) => {
    expect(labelView('integration-test', value, integrationTest).style).toBe(style)
  })

  it("falls back to the definition's style", () => {
    expect(labelView('jenkins-build', 'http://ci/1', jenkinsBuild).style).toBe('INFO')
  })

  it.each([
    ['http://my-jenkins/1', 'url'],
    [' HTTPS://my-jenkins/1 ', 'url'],
    ['not a url', 'text'],
    ['javascript:alert(1)', 'text']
  ])('shows the URL %s as %s', (value, kind) => {
    expect(labelView('jenkins-build', value, jenkinsBuild).kind).toBe(kind)
  })

  it.each([
    ['true', 'boolean', true],
    [' False ', 'boolean', false],
    ['maybe', 'text', false]
  ])('shows the boolean %s as %s', (value, kind, truthy) => {
    expect(labelView('released', value, aBooleanDefinition())).toMatchObject({kind, truthy})
  })

  it('shows regex and integer values in monospace, others as text', () => {
    expect(labelView('revision', 'abc', revision).kind).toBe('mono')
    expect(labelView('count', '3', {...revision, key: 'count', type: 'INTEGER'}).kind).toBe('mono')
    expect(labelView('note', 'hi', {...revision, key: 'note', type: 'STRING'}).kind).toBe('text')
  })
})

describe('styleClass', () => {
  it.each([
    ['INFO', 'badge-info'],
    ['SUCCESS', 'badge-success'],
    ['WARNING', 'badge-warning'],
    ['ERROR', 'badge-error'],
    [null, 'badge-neutral']
  ] as const)('maps %s to %s', (style, cssClass) => {
    expect(styleClass(style)).toBe(cssClass)
  })
})

describe('definitionOf', () => {
  it('finds the definition of a key, ignoring case', () => {
    expect(definitionOf('Jenkins-Build', someLabelDefinitions())?.key).toBe('jenkins-build')
    expect(definitionOf('part-of-build-set', someLabelDefinitions())).toBeUndefined()
  })
})
