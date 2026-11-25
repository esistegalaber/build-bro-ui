import {ChangeDetectionStrategy, Component, computed, input, linkedSignal, output} from '@angular/core'
import {form, FormField, FormRoot} from '@angular/forms/signals'
import {ILabelDefinition, LabelStyle, LabelTarget, LabelType} from '../../core'
import {LabelReport} from '../state/labels-admin.reducer'
import {LabelViolationsTable} from './label-violations.table'

/** A definition to save: the key goes into the URL. */
export interface LabelDefinitionDraft {
  key: string
  definition: ILabelDefinition
}

/** What the form edits: flat text and boolean fields (see Forms in CLAUDE.md). */
interface DefinitionFields {
  key: string
  displayName: string
  description: string
  appliesToBuild: boolean
  appliesToDeployment: boolean
  type: string
  /** For ENUM: one allowed value per line, in display order */
  allowedValues: string
  /** For REGEX */
  pattern: string
  /** '' for none */
  style: string
}

export const LABEL_TYPES: { value: LabelType, name: string }[] = [
  {value: 'STRING', name: 'Text'},
  {value: 'BOOLEAN', name: 'Boolean (true / false)'},
  {value: 'INTEGER', name: 'Integer'},
  {value: 'URL', name: 'URL'},
  {value: 'ENUM', name: 'One of a list'},
  {value: 'REGEX', name: 'Matching a pattern'}
]
export const LABEL_STYLES: LabelStyle[] = ['INFO', 'SUCCESS', 'WARNING', 'ERROR']

function fieldsOf(definition: ILabelDefinition | null): DefinitionFields {
  return {
    key: definition?.key ?? '',
    displayName: definition?.displayName ?? '',
    description: definition?.description ?? '',
    appliesToBuild: definition ? definition.appliesTo.includes('BUILD') : true,
    appliesToDeployment: definition ? definition.appliesTo.includes('DEPLOYMENT') : true,
    type: definition?.type ?? 'STRING',
    allowedValues: (definition?.allowedValues ?? []).join('\n'),
    pattern: definition?.pattern ?? '',
    style: definition?.style ?? ''
  }
}

function linesOf(text: string): string[] {
  return text.split('\n').map((line) => line.trim()).filter((line) => line !== '')
}

/**
 * Creates or edits one label definition. The fields follow the type: allowed values for ENUM, a pattern for REGEX,
 * a style per value for ENUM and BOOLEAN. "Preview" asks the API which stored labels would no longer fit, without
 * saving; the answer (and the one after saving) shows below the form.
 */
@Component({
  selector: 'bb-label-definition-form',
  template: `
    <form class="card bg-base-100 border border-base-300 shadow-sm" [formRoot]="definitionForm" (keydown.escape)="cancel.emit()"
          [attr.aria-label]="isNew() ? 'New label definition' : 'Edit ' + fields().key" data-testid="label-definition-form">
      <div class="card-body gap-4 p-5">
        <div>
          <h2 class="text-lg font-bold wrap-anywhere">{{ isNew() ? 'New label definition' : 'Edit ' + fields().key }}</h2>
          <p class="text-sm text-base-content/70">Existing labels are never changed. Preview shows which ones would no longer fit.</p>
        </div>
        @if (isNew()) {
          <label class="flex flex-col gap-1">
            <span class="text-sm font-medium">Label key</span>
            <input class="input w-full font-mono" placeholder="e.g. qa" [formField]="definitionForm.key" data-testid="label-key"/>
          </label>
        }
        <div class="flex flex-wrap gap-4">
          <label class="flex grow basis-40 flex-col gap-1">
            <span class="text-sm font-medium">Display name</span>
            <input class="input w-full" placeholder="optional" [formField]="definitionForm.displayName" data-testid="label-display-name"/>
          </label>
          <label class="flex grow basis-40 flex-col gap-1">
            <span class="text-sm font-medium">Type</span>
            <select class="select w-full" [formField]="definitionForm.type" data-testid="label-type">
              @for (type of types; track type.value) {
                <option [value]="type.value">{{ type.name }}</option>
              }
            </select>
          </label>
        </div>
        <label class="flex flex-col gap-1">
          <span class="text-sm font-medium">Description</span>
          <input class="input w-full" placeholder="optional" [formField]="definitionForm.description" data-testid="label-description"/>
        </label>
        <fieldset class="flex flex-wrap gap-x-6 gap-y-2">
          <legend class="mb-1 text-sm font-medium">Meant for</legend>
          <label class="flex items-center gap-2">
            <input type="checkbox" class="checkbox checkbox-sm" [formField]="definitionForm.appliesToBuild" data-testid="label-applies-build"/>builds
          </label>
          <label class="flex items-center gap-2">
            <input type="checkbox" class="checkbox checkbox-sm" [formField]="definitionForm.appliesToDeployment" data-testid="label-applies-deployment"/>deployments
          </label>
        </fieldset>
        @if (fields().type === 'ENUM') {
          <label class="flex flex-col gap-1">
            <span class="text-sm font-medium">Allowed values, one per line</span>
            <textarea class="textarea w-full font-mono" rows="4" placeholder="passed&#10;pending&#10;failed"
                      [formField]="definitionForm.allowedValues" data-testid="label-allowed-values"></textarea>
          </label>
        }
        @if (fields().type === 'REGEX') {
          <label class="flex flex-col gap-1">
            <span class="text-sm font-medium">Pattern (the whole value must match)</span>
            <input class="input w-full font-mono" placeholder="[0-9a-f]{7,40}" [formField]="definitionForm.pattern" data-testid="label-pattern"/>
          </label>
        }
        <label class="flex flex-col gap-1">
          <span class="text-sm font-medium">Style</span>
          <select class="select w-full" [formField]="definitionForm.style" data-testid="label-style">
            <option value="">neutral</option>
            @for (style of styles; track style) {
              <option [value]="style">{{ style.toLowerCase() }}</option>
            }
          </select>
        </label>
        @if (styledValues().length > 0) {
          <fieldset class="flex flex-col gap-2" data-testid="label-value-styles">
            <legend class="mb-1 text-sm font-medium">Style per value</legend>
            @for (value of styledValues(); track value) {
              <label class="flex items-center gap-3">
                <span class="min-w-24 font-mono text-sm">{{ value }}</span>
                <!-- the options mark the current style: a [value] on the select would come before its options exist -->
                <select class="select select-sm grow" (change)="setValueStyle(value, $event)"
                        [attr.data-testid]="'label-value-style-' + value">
                  <option value="" [selected]="!valueStyles()[value]">as the label</option>
                  @for (style of styles; track style) {
                    <option [value]="style" [selected]="valueStyles()[value] === style">{{ style.toLowerCase() }}</option>
                  }
                </select>
              </label>
            }
          </fieldset>
        }
        <div class="flex flex-wrap justify-end gap-2">
          <button type="button" class="btn btn-ghost" (click)="cancel.emit()" data-testid="label-cancel">Cancel</button>
          <button type="button" class="btn btn-soft btn-primary" [disabled]="!canSave()" (click)="preview()"
                  data-testid="label-preview">Preview</button>
          <button type="submit" class="btn btn-primary" [disabled]="!canSave()" data-testid="label-save">Save</button>
        </div>

        @if (shownReport(); as report) {
          <div class="flex flex-col gap-2 border-t border-base-300 pt-4" data-testid="label-report">
            <p class="text-sm font-medium">
              @if (report.saved) {
                Saved.
              }
              @if (report.change.violations.length === 0) {
                All stored labels with this key fit{{ report.saved ? '' : ' this definition' }}.
              } @else {
                {{ report.change.violations.length }} {{ report.change.violations.length === 1 ? 'value doesn’t' : 'values don’t' }} fit{{ report.saved ? '' : ' this definition' }}:
              }
            </p>
            @if (report.change.violations.length > 0) {
              <bb-label-violations-table [violations]="report.change.violations" [showKey]="false"></bb-label-violations-table>
            }
          </div>
        }
      </div>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormRoot, FormField, LabelViolationsTable]
})
export class LabelDefinitionForm {
  /** The definition to edit, or null for a new one */
  readonly definition = input<ILabelDefinition | null>(null)
  /** The last preview or save result; shown when it is about this form's key */
  readonly report = input<LabelReport | null>(null)
  readonly previewDefinition = output<LabelDefinitionDraft>()
  readonly saveDefinition = output<LabelDefinitionDraft>()
  readonly cancel = output<void>()

  readonly types = LABEL_TYPES
  readonly styles = LABEL_STYLES

  readonly isNew = computed(() => this.definition() === null)
  /** Starts over whenever another definition is opened (or the saved one comes back from the store). */
  readonly fields = linkedSignal(() => fieldsOf(this.definition()))
  readonly valueStyles = linkedSignal((): Record<string, string> => ({...(this.definition()?.valueStyles ?? {})}))
  readonly definitionForm = form(this.fields, {
    submission: {action: async () => this.save()}
  })

  readonly canSave = computed(() => this.fields().key.trim() !== '')

  /** The values that can get their own style: the allowed values of an enum, or true and false. */
  readonly styledValues = computed((): string[] => {
    const fields = this.fields()
    if (fields.type === 'ENUM') return [...new Set(linesOf(fields.allowedValues))]
    if (fields.type === 'BOOLEAN') return ['true', 'false']
    return []
  })

  readonly shownReport = computed(() => {
    const report = this.report()
    const key = this.fields().key.trim().toLowerCase()
    return report && report.change.definition.key.toLowerCase() === key ? report : null
  })

  setValueStyle(value: string, event: Event): void {
    const style = (event.target as HTMLSelectElement).value
    this.valueStyles.update((styles) => {
      const {[value]: _, ...others} = styles
      return style ? {...others, [value]: style} : others
    })
  }

  preview(): void {
    if (this.canSave()) this.previewDefinition.emit(this.draft())
  }

  private save(): void {
    if (this.canSave()) this.saveDefinition.emit(this.draft())
  }

  /** The definition as the API takes it: only the parts that belong to the type. */
  draft(): LabelDefinitionDraft {
    const fields = this.fields()
    const key = fields.key.trim()
    const type = fields.type as LabelType
    const appliesTo: LabelTarget[] = [
      ...(fields.appliesToBuild ? ['BUILD' as const] : []),
      ...(fields.appliesToDeployment ? ['DEPLOYMENT' as const] : [])
    ]
    const styled = new Set(this.styledValues())
    const valueStyles = Object.fromEntries(Object.entries(this.valueStyles())
      .filter(([value]) => styled.has(value))) as Record<string, LabelStyle>
    return {
      key,
      definition: {
        key,
        displayName: fields.displayName.trim() || undefined,
        description: fields.description.trim() || undefined,
        appliesTo,
        type,
        allowedValues: type === 'ENUM' ? [...styled] : [],
        pattern: type === 'REGEX' ? fields.pattern.trim() || undefined : undefined,
        style: (fields.style || undefined) as LabelStyle | undefined,
        valueStyles
      }
    }
  }
}
