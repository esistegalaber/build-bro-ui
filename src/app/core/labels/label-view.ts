import {ILabelDefinition, LabelStyle} from '../state/model'

/** How a value is shown: as a link, as a yes/no icon, in a monospace font, or as plain text. */
export type LabelValueKind = 'url' | 'boolean' | 'mono' | 'text'

/** Everything a template needs to show one label. */
export interface LabelView {
  /** The display name if the definition has one, else the key. */
  name: string
  /** Tooltip: the key (when a display name is shown) and the description. */
  title: string | null
  /** The style that applies: the value's own style, else the definition's, else none (neutral). */
  style: LabelStyle | null
  kind: LabelValueKind
  /** For `boolean`: whether the value is true. */
  truthy: boolean
}

const STYLE_CLASSES: Record<LabelStyle, string> = {
  INFO: 'badge-info',
  SUCCESS: 'badge-success',
  WARNING: 'badge-warning',
  ERROR: 'badge-error'
}

/** The daisyUI badge class of a style; `badge-neutral` without one. */
export function styleClass(style: LabelStyle | null): string {
  return style ? STYLE_CLASSES[style] : 'badge-neutral'
}

/** The definition of `key`, compared ignoring case like the API does. */
export function definitionOf(key: string, definitions: readonly ILabelDefinition[]): ILabelDefinition | undefined {
  const wanted = key.toLowerCase()
  return definitions.find((definition) => definition.key.toLowerCase() === wanted)
}

/**
 * How to show `key=value` given its definition. Without a definition, the label is shown as before: its key, plain
 * text, no style. A value that doesn't fit its type is shown as text rather than as a broken link or icon.
 */
export function labelView(key: string, value: string, definition?: ILabelDefinition): LabelView {
  if (!definition) {
    return {name: key, title: null, style: null, kind: 'text', truthy: false}
  }
  const trimmed = value.trim().toLowerCase()
  const valueStyle = Object.entries(definition.valueStyles ?? {})
    .find(([styledValue]) => styledValue.toLowerCase() === value.toLowerCase())?.[1]
  const title = [definition.displayName ? definition.key : null, definition.description ?? null]
    .filter((part) => !!part).join(' · ')
  return {
    name: definition.displayName || definition.key,
    title: title || null,
    style: valueStyle ?? definition.style ?? null,
    kind: kindOf(definition, trimmed),
    truthy: trimmed === 'true'
  }
}

function kindOf(definition: ILabelDefinition, trimmed: string): LabelValueKind {
  switch (definition.type) {
    case 'URL':
      return /^https?:\/\/[^/\s]+/.test(trimmed) ? 'url' : 'text'
    case 'BOOLEAN':
      return trimmed === 'true' || trimmed === 'false' ? 'boolean' : 'text'
    case 'REGEX':
    case 'INTEGER':
      return 'mono'
    default:
      return 'text'
  }
}
