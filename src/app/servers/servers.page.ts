import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core'
import {AsyncPipe} from '@angular/common'
import {Store} from '@ngrx/store'
import {Buildz, IServer} from '../core'
import {allServers} from '../core/state/servers/server.selectors'
import * as CoreActions from '../core/actions'
import {ServerList} from './ui/server.list'
import {ServerDetailsForm} from './ui/server-details.form'

@Component({
  template: `
    <div class="flex flex-col gap-6">
      <header class="flex flex-col gap-1">
        <h1 class="text-3xl font-extrabold tracking-tight">Servers</h1>
        <p class="text-base-content/70">Where builds get deployed. A nickname makes them easier to tell apart.</p>
      </header>

      <div class="flex flex-wrap items-start gap-6">
        <bb-server-list class="block min-w-0 grow-[999] basis-[420px]"
                        [servers]="(servers$ | async) ?? []" [selectedId]="selected()?.id ?? null"
                        (editServer)="selected.set($event)"></bb-server-list>
        <bb-server-details-form class="block min-w-0 grow basis-72 sticky top-6"
                                [server]="selected()" (updateServer)="save($event)"
                                (cancel)="selected.set(null)"></bb-server-details-form>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AsyncPipe, ServerList, ServerDetailsForm]
})
export class ServersPage {
  private store = inject<Store<Buildz>>(Store)

  servers$ = this.store.select(allServers)
  /** The server being edited, or null */
  readonly selected = signal<IServer | null>(null)

  save(server: IServer): void {
    this.store.dispatch(CoreActions.updateServer({server}))
    this.selected.set(null)
  }
}
