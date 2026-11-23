import {ChangeDetectionStrategy, Component, computed, input} from '@angular/core'
import {ILabelDefinition, labelView, styleClass} from '../../core'

/**
 * One label, shown by its definition (build-bro-api#7): styled by its value or definition (info, success, warning,
 * error), a URL as a link, a boolean as an icon, hashes and numbers in monospace, the display name instead of the key.
 *
 * - `mode="chip"` (default): a badge with name and value, e.g. on deployments and as a search filter. Labels without a
 *   definition keep the old look (`badge-primary`). Content (e.g. a remove button) goes at the end of the badge.
 * - `mode="value"`: only the value, e.g. next to the key in a build's label list. A badge only when a style applies.
 */
@Component({
  selector: 'bb-label-chip',
  template: `
    @let v = view();
    <span [class]="classes()" [attr.title]="v.title" data-cy-id="label-chip" [attr.data-label-style]="v.style">
      @if (mode() === 'chip') {
        <span>{{ v.name }} = </span>
      }
      @switch (v.kind) {
        @case ('url') {
          <a class="link break-all" [href]="value().trim()" target="_blank" rel="noopener noreferrer"
             data-cy-id="label-link">{{ value() }}</a>
        }
        @case ('boolean') {
          <span class="inline-flex items-center gap-0.5">
            <span class="material-icons text-[14px]" aria-hidden="true">{{ v.truthy ? 'check_circle' : 'cancel' }}</span>{{ value() }}
          </span>
        }
        @case ('mono') {
          <span class="font-mono break-all">{{ value() }}</span>
        }
        @default {
          <span>{{ value() }}</span>
        }
      }
      <ng-content></ng-content>
    </span>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LabelChip {
  readonly labelKey = input.required<string>()
  readonly value = input.required<string>()
  /** The label's definition, if it has one. */
  readonly definition = input<ILabelDefinition | undefined>(undefined)
  readonly mode = input<'chip' | 'value'>('chip')

  readonly view = computed(() => labelView(this.labelKey(), this.value(), this.definition()))

  readonly classes = computed(() => {
    const v = this.view()
    if (this.mode() === 'value') {
      return v.style ? `badge badge-soft h-auto py-0.5 ${styleClass(v.style)}` : ''
    }
    const color = this.definition() ? styleClass(v.style) : 'badge-primary'
    return `badge badge-soft h-auto gap-1 py-1 ${color}`
  })
}
