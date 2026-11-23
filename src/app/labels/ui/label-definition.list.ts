import {ChangeDetectionStrategy, Component, input, output} from '@angular/core'
import {ILabelDefinition, styleClass} from '../../core'
import {LabelChip} from '../../ui/labels/label-chip'
import {EmptyState} from '../../ui/empty-state'

const TYPE_NAMES: Record<ILabelDefinition['type'], string> = {
  STRING: 'Text', BOOLEAN: 'Boolean', INTEGER: 'Integer', URL: 'URL', ENUM: 'One of a list', REGEX: 'Pattern'
}

/** The label definitions, with a preview of how their values look. */
@Component({
  selector: 'bb-label-definition-list',
  template: `
    <section class="card bg-base-100 border border-base-300 shadow-sm overflow-hidden" aria-label="Label definitions">
      @for (definition of definitions(); track definition.key) {
        <div class="flex flex-wrap items-center gap-x-4 gap-y-2 px-5 py-3 border-b border-base-300 last:border-b-0"
             [class.bg-base-200]="definition.key === selectedKey()" data-cy-id="label-definition">
          <div class="flex min-w-0 grow basis-48 flex-col">
            <span class="font-semibold">{{ definition.displayName || definition.key }}</span>
            <span class="text-sm text-base-content/70">
              <span class="font-mono">{{ definition.key }}</span> · {{ typeName(definition) }} · {{ targets(definition) }}
            </span>
          </div>
          <div class="flex flex-wrap gap-1.5" data-cy-id="label-definition-preview">
            @for (value of sampleValues(definition); track value) {
              <bb-label-chip [labelKey]="definition.key" [value]="value" [definition]="definition" mode="value"></bb-label-chip>
            }
            @if (definition.style) {
              <span class="badge badge-soft badge-sm" [class]="styleClass(definition.style)">{{ definition.style.toLowerCase() }}</span>
            }
          </div>
          <div class="flex gap-1">
            <button type="button" class="btn btn-sm btn-soft btn-primary" (click)="editDefinition.emit(definition)"
                    [attr.aria-label]="'Edit ' + definition.key" data-cy-id="label-definition-edit">
              <span class="material-icons text-[18px]" aria-hidden="true">edit</span>Edit
            </button>
            <button type="button" class="btn btn-sm btn-ghost text-error" (click)="deleteDefinition.emit(definition)"
                    [attr.aria-label]="'Delete ' + definition.key" data-cy-id="label-definition-delete">
              <span class="material-icons text-[18px]" aria-hidden="true">delete</span>
            </button>
          </div>
        </div>
      } @empty {
        <bb-empty-state icon="sell" data-cy-id="label-definitions-none">
          <p>No label definitions yet: all labels are free-form. Describe a label key to give it a type and a style.</p>
        </bb-empty-state>
      }
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LabelChip, EmptyState]
})
export class LabelDefinitionList {
  readonly definitions = input.required<ILabelDefinition[]>()
  readonly selectedKey = input<string | null>(null)
  readonly editDefinition = output<ILabelDefinition>()
  readonly deleteDefinition = output<ILabelDefinition>()

  readonly styleClass = styleClass

  typeName(definition: ILabelDefinition): string {
    return TYPE_NAMES[definition.type]
  }

  targets(definition: ILabelDefinition): string {
    const names = definition.appliesTo.map((target) => target === 'BUILD' ? 'builds' : 'deployments')
    return names.length === 2 ? 'builds and deployments' : names[0] ?? 'builds and deployments'
  }

  /** The values worth showing as chips: the allowed values of an enum, true/false, or the styled values. */
  sampleValues(definition: ILabelDefinition): string[] {
    if (definition.type === 'ENUM') return definition.allowedValues
    if (definition.type === 'BOOLEAN') return ['true', 'false']
    return Object.keys(definition.valueStyles ?? {})
  }
}
