import {ChangeDetectionStrategy, Component, input} from '@angular/core'

/** A small spinner with a label while data is on its way; screen readers hear the label. */
@Component({
  selector: 'bb-loading',
  host: {class: 'flex items-center justify-center gap-2 py-6 text-base-content/70', role: 'status'},
  template: `
    <span class="size-4 rounded-full border-2 border-current border-t-transparent animate-spin motion-reduce:animate-none" aria-hidden="true"></span>
    <span>{{ label() }}</span>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Loading {
  readonly label = input('Loading…')
}
