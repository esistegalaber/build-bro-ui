import {ILabelDefinition, LabelTarget} from '../state/model'

const INTEGER = /^[+-]?\d+$/

/**
 * Whether `value` fits `definition`, the way the API checks it (build-bro-api `LabelValues`): ignoring case, and for
 * `BOOLEAN`, `INTEGER` and `URL` ignoring surrounding whitespace. A regex must match the whole value (JavaScript
 * regex syntax, which covers the usual patterns; the API uses Java's).
 */
export function fitsDefinition(definition: ILabelDefinition, value: string): boolean {
  const trimmed = value.trim()
  switch (definition.type) {
    case 'BOOLEAN':
      return /^(true|false)$/i.test(trimmed)
    case 'INTEGER':
      return INTEGER.test(trimmed)
    case 'URL':
      return isHttpUrl(trimmed)
    case 'ENUM':
      return definition.allowedValues.some((allowed) => allowed.toLowerCase() === value.toLowerCase())
    case 'REGEX':
      return !!definition.pattern && matchesWhole(definition.pattern, value)
    default:
      return true
  }
}

/** Why a label on `target` with `value` doesn't fit, or null if it fits. */
export function violationOf(definition: ILabelDefinition, target: LabelTarget, value: string): 'INVALID_VALUE' | 'WRONG_TARGET' | null {
  if (!definition.appliesTo.includes(target)) {
    return 'WRONG_TARGET'
  }
  return fitsDefinition(definition, value) ? null : 'INVALID_VALUE'
}

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value)
    return (url.protocol === 'http:' || url.protocol === 'https:') && url.hostname !== ''
  } catch {
    return false
  }
}

function matchesWhole(pattern: string, value: string): boolean {
  try {
    return new RegExp(`^(?:${pattern})$`, 'i').test(value)
  } catch {
    return false
  }
}

/** What a value of `definition` must look like, for hints (like the API's error messages). */
export function expectedValue(definition: ILabelDefinition): string {
  switch (definition.type) {
    case 'BOOLEAN':
      return 'true or false'
    case 'INTEGER':
      return 'a whole number'
    case 'URL':
      return 'an absolute http(s) URL'
    case 'ENUM':
      return `one of ${definition.allowedValues.join(', ')}`
    case 'REGEX':
      return `a value matching ${definition.pattern}`
    default:
      return 'any value'
  }
}

/**
 * The labels that don't fit their definition on `target`, as messages like the API's, e.g.
 * "integration-test=passed: expected one of ok, broken". Labels without a definition always fit.
 */
export function labelProblems(labels: Record<string, string>, definitions: readonly ILabelDefinition[], target: LabelTarget): string[] {
  return Object.entries(labels).flatMap(([key, value]) => {
    const definition = definitions.find((d) => d.key.toLowerCase() === key.toLowerCase())
    const violation = definition ? violationOf(definition, target, value) : null
    if (!definition || !violation) return []
    return violation === 'WRONG_TARGET'
      ? [`${key}: not meant for ${target === 'BUILD' ? 'builds' : 'deployments'}`]
      : [`${key}=${value}: expected ${expectedValue(definition)}`]
  })
}
