import {CloningPipe} from './cloning.pipe'
import {SortedLabelsPipe} from './sort-label.pipe'
import {deepClone} from '../util/deep-clone'
import {IBuildLabel} from '../state/model'

describe('CloningPipe (deepClone)', () => {
  const pipe = new CloningPipe()

  it('returns an equal copy that shares nothing with the original', () => {
    const original = {name: 'main', buildTemplates: [{project: 'backend', labels: {a: '1'}}]}
    const copy = pipe.transform(original)
    expect(copy).toEqual(original)
    copy.buildTemplates[0].labels.a = 'changed'
    expect(original.buildTemplates[0].labels.a).toBe('1')
  })

  it('makes frozen store state editable', () => {
    const frozen = Object.freeze({name: 'main'})
    const copy = pipe.transform(frozen)
    copy.name = 'edited'
    expect(copy.name).toBe('edited')
  })

  it('passes null through (what the async pipe gives before the first value)', () => {
    expect(pipe.transform(null)).toBeNull()
  })
})

describe('deepClone', () => {
  it('copies deeply', () => {
    const original = {labels: [{key: 'a'}]}
    const copy = deepClone(original)
    expect(copy).toEqual(original)
    expect(copy.labels).not.toBe(original.labels)
  })
})

describe('SortedLabelsPipe', () => {
  const pipe = new SortedLabelsPipe()
  const labels = (): IBuildLabel[] => [
    {id: 1, key: 'integration-test', value: 'ok'},
    {id: 2, key: 'revision', value: 'e6859b79'},
    {id: 3, key: 'jenkins-build', value: 'http://my-jenkins/1'}
  ]

  it('sorts the labels by key, Z to A', () => {
    expect(pipe.transform(labels()).map((l: IBuildLabel) => l.key)).toEqual(['revision', 'jenkins-build', 'integration-test'])
  })

  it('leaves the input array alone, so it can be used on frozen store state', () => {
    const input = Object.freeze(labels()) as IBuildLabel[]
    expect(() => pipe.transform(input)).not.toThrow()
    expect(input.map((l) => l.key)).toEqual(['integration-test', 'revision', 'jenkins-build'])
  })
})
