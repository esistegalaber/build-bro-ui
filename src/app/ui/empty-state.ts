import {booleanAttribute, ChangeDetectionStrategy, Component, input} from '@angular/core'

/**
 * Says that there is nothing to show, and what to do about it (projected: a message, maybe a button).
 * framed: a dashed box, for a place on the page; otherwise it sits inside a card.
 * compact: less space and smaller text, for side panels and short lists.
 */
@Component({
  selector: 'bb-empty-state',
  host: {
    class: 'flex flex-col items-center text-center text-base-content/70',
    '[class.rounded-box]': 'framed()',
    '[class.border]': 'framed()',
    '[class.border-dashed]': 'framed()',
    '[class.border-base-300]': 'framed()',
    '[class]': 'compact() ? "gap-2 p-4 text-sm" : "gap-3 px-5 py-10"'
  },
  template: `
    @if (icon()) {
      <span class="material-icons" [class]="compact() ? 'text-2xl!' : 'text-4xl!'" aria-hidden="true">{{ icon() }}</span>
    }
    <ng-content></ng-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmptyState {
  readonly icon = input<string>('')
  readonly framed = input(false, {transform: booleanAttribute})
  readonly compact = input(false, {transform: booleanAttribute})
}
