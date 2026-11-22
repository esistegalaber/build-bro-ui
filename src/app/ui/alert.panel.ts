import {ChangeDetectionStrategy, Component, computed, input, output} from '@angular/core'
import {IAlert} from '../core'

const LOOKS: Record<string, { icon: string, classes: string }> = {
  'alert-error': {icon: 'error', classes: 'alert-error'},
  'alert-info': {icon: 'info', classes: 'alert-info'}
}

/** The current message (an error or an info) above the page, until it is dismissed. */
@Component({
  selector: 'bz-alert-panel',
  host: {class: 'contents'},
  template: `
    @if (alert().message.length > 0) {
      <div class="alert alert-soft alert-horizontal items-start border" [class]="look().classes"
           [attr.role]="isError() ? 'alert' : 'status'" data-cy-id="alert">
        <span class="material-icons" aria-hidden="true">{{ look().icon }}</span>
        <div class="min-w-0">
          @if (alert().heading) {
            <h2 class="font-bold" data-cy-id="alert-heading">{{ alert().heading }}</h2>
          }
          <p class="text-sm wrap-anywhere" data-cy-id="alert-message">{{ alert().message }}</p>
        </div>
        <button type="button" class="btn btn-sm btn-ghost btn-square" aria-label="Dismiss"
                (click)="clearAlert.emit()" data-cy-id="alert-ok">
          <span class="material-icons text-[20px]" aria-hidden="true">close</span>
        </button>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AlertPanel {
  readonly alert = input.required<IAlert>()
  readonly clearAlert = output<void>()

  readonly look = computed(() => LOOKS[this.alert().type] ?? LOOKS['alert-info'])
  readonly isError = computed(() => this.alert().type === 'alert-error')
}
