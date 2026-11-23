import {expectedValue, fitsDefinition, labelProblems, violationOf} from './label-values'
import {ILabelDefinition, LabelType} from '../state/model'

const definition = (type: LabelType, extra: Partial<ILabelDefinition> = {}): ILabelDefinition =>
  ({key: 'k', appliesTo: ['BUILD'], type, allowedValues: [], valueStyles: {}, ...extra})

describe('fitsDefinition', () => {
  it.each([
    ['STRING', {}, 'anything', true],
    ['BOOLEAN', {}, ' TRUE ', true],
    ['BOOLEAN', {}, 'yes', false],
    ['INTEGER', {}, ' -42 ', true],
    ['INTEGER', {}, '4.2', false],
    ['URL', {}, 'https://ci.example.com/1', true],
    ['URL', {}, 'ftp://ci.example.com', false],
    ['URL', {}, 'ci.example.com', false],
    ['ENUM', {allowedValues: ['passed', 'failed']}, 'PASSED', true],
    ['ENUM', {allowedValues: ['passed', 'failed']}, 'pass', false],
    ['REGEX', {pattern: '[0-9a-f]{7}'}, 'ABC1234', true],
    ['REGEX', {pattern: '[0-9a-f]{7}'}, 'abc12345', false],
    ['REGEX', {pattern: '[0-9'}, 'abc', false],
    ['REGEX', {}, 'abc', false]
  ] as [LabelType, Partial<ILabelDefinition>, string, boolean][])('%s %o: %s fits %s', (type, extra, value, fits) => {
    expect(fitsDefinition(definition(type, extra), value)).toBe(fits)
  })
})

describe('violationOf', () => {
  const qa = definition('ENUM', {allowedValues: ['passed']})

  it('finds a label on the wrong entity before a wrong value', () => {
    expect(violationOf(qa, 'DEPLOYMENT', 'nope')).toBe('WRONG_TARGET')
    expect(violationOf(qa, 'BUILD', 'nope')).toBe('INVALID_VALUE')
    expect(violationOf(qa, 'BUILD', 'Passed')).toBeNull()
  })
})

describe('expectedValue', () => {
  it.each([
    ['STRING', {}, 'any value'],
    ['BOOLEAN', {}, 'true or false'],
    ['INTEGER', {}, 'a whole number'],
    ['URL', {}, 'an absolute http(s) URL'],
    ['ENUM', {allowedValues: ['ok', 'broken']}, 'one of ok, broken'],
    ['REGEX', {pattern: '\\d+'}, 'a value matching \\d+']
  ] as [LabelType, Partial<ILabelDefinition>, string][])('%s: %s', (type, extra, expected) => {
    expect(expectedValue(definition(type, extra))).toBe(expected)
  })
})

describe('labelProblems', () => {
  const definitions = [
    definition('ENUM', {key: 'integration-test', allowedValues: ['ok', 'broken']}),
    definition('BOOLEAN', {key: 'released', appliesTo: ['DEPLOYMENT']})
  ]

  it('names the labels that don\'t fit, like the API, ignoring keys without a definition', () => {
    expect(labelProblems({'Integration-Test': 'passed', released: 'true', 'part-of-build-set': 'main'}, definitions, 'BUILD'))
      .toEqual(['Integration-Test=passed: expected one of ok, broken', 'released: not meant for builds'])
    expect(labelProblems({'integration-test': 'OK'}, definitions, 'BUILD')).toEqual([])
  })
})
