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
