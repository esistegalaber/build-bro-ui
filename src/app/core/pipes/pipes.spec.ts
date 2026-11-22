import {SortedLabelsPipe} from './sort-label.pipe'
import {IBuildLabel} from '../state/model'

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
