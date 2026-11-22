import {ChangeDetectionStrategy, Component, input} from '@angular/core'

/** The top of a page: its title, one line about it, and the page's actions (projected). */
@Component({
  selector: 'bb-page-header',
  host: {class: 'flex flex-wrap items-end justify-between gap-4'},
  template: `
    <div class="flex flex-col gap-1">
      <h1 class="text-3xl font-extrabold tracking-tight">{{ heading() }}</h1>
      @if (description()) {
        <p class="text-base-content/70">{{ description() }}</p>
      }
    </div>
    <ng-content></ng-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageHeader {
  readonly heading = input.required<string>()
  readonly description = input<string>('')
}
