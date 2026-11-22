import {afterRenderEffect, ChangeDetectionStrategy, Component, ElementRef, input, linkedSignal, output, viewChild} from '@angular/core'
import {form, FormField, FormRoot} from '@angular/forms/signals'
import {IServer} from '../../core'
import {EmptyState} from '../../ui/empty-state'

/** Edits the nickname and description of one server; works on its own copy until Save. */
@Component({
  selector: 'bb-server-details-form',
  template: `
    @if (server(); as server) {
      <form class="card bg-base-100 border border-base-300 shadow-sm" [attr.aria-label]="'Edit ' + server.name"
            [formRoot]="detailsForm" (keydown.escape)="cancel.emit()" data-cy-id="server-form">
        <div class="card-body gap-4 p-5">
          <div>
            <h2 class="text-lg font-bold wrap-anywhere">Edit {{ server.name }}</h2>
            <p class="text-sm text-base-content/70">The nickname shows next to the server name everywhere.</p>
          </div>
          <label class="flex flex-col gap-1">
            <span class="text-sm font-medium">Nickname</span>
            <input #nickNameInput class="input w-full" placeholder="e.g. Staging"
                   [formField]="detailsForm.nickName" data-cy-id="server-nickname"/>
          </label>
          <label class="flex flex-col gap-1">
            <span class="text-sm font-medium">Description</span>
            <textarea class="textarea w-full" rows="3" placeholder="What runs here?"
                      [formField]="detailsForm.description" data-cy-id="server-description"></textarea>
          </label>
          <div class="flex justify-end gap-2">
            <button type="button" class="btn btn-ghost" (click)="cancel.emit()" data-cy-id="edit-server-cancel">Cancel</button>
            <button type="submit" class="btn btn-primary" data-cy-id="server-save">Save</button>
          </div>
        </div>
      </form>
    } @else {
      <bb-empty-state icon="edit_note" framed data-cy-id="server-none">
        <p>Choose a server to give it a nickname or description.</p>
      </bb-empty-state>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormRoot, FormField, EmptyState]
})
export class ServerDetailsForm {
  readonly server = input<IServer | null>(null)
  readonly updateServer = output<IServer>()
  readonly cancel = output<void>()

  /** what the form edits: starts over whenever another server is chosen */
  readonly fields = linkedSignal(() => ({nickName: this.server()?.nickName ?? '', description: this.server()?.description ?? ''}))
  readonly detailsForm = form(this.fields, {
    submission: {action: async () => this.save()}
  })
  private readonly nickNameInput = viewChild<ElementRef<HTMLInputElement>>('nickNameInput')

  constructor() {
    // a newly chosen server: start typing right away
    afterRenderEffect(() => {
      if (this.server()) this.nickNameInput()?.nativeElement.focus()
    })
  }

  private save(): void {
    const server = this.server()
    if (server) this.updateServer.emit({...server, ...this.fields()})
  }
}
