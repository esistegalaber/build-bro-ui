import {fitsDefinition, violationOf} from './label-values'
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
