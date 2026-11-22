import {ChangeDetectionStrategy, Component, input, output} from '@angular/core'
import {IServer} from '../../core'

/** All servers with nickname and description; the one being edited is highlighted. */
@Component({
  selector: 'bb-server-list',
  template: `
    <section class="card bg-base-100 border border-base-300 shadow-sm overflow-hidden" aria-label="Servers">
      <div class="px-5 py-4 border-b border-base-300">
        <h2 class="text-lg font-bold" data-cy-id="servers-count">
          {{ servers().length }} {{ servers().length === 1 ? 'server' : 'servers' }}
        </h2>
      </div>
      <ul>
        @for (server of servers(); track server.id) {
          <li class="flex items-center gap-3 px-5 py-3 not-last:border-b not-last:border-base-300"
              [class.bg-primary/10]="server.id === selectedId()"
              [attr.aria-current]="server.id === selectedId() ? 'true' : null"
              attr.data-cy-id="server-{{server.name}}">
            <span class="size-9 shrink-0 rounded-xl grid place-items-center" aria-hidden="true"
                  [class]="server.id === selectedId() ? 'bg-primary/15 text-primary' : 'bg-base-200 text-base-content/70'">
              <span class="material-icons text-[18px]">dns</span>
            </span>
            <div class="min-w-0 grow">
              <div class="font-semibold wrap-anywhere" data-cy-id="server-name">{{ server.name }}
                @if (server.nickName) {
                  <span class="font-medium text-base-content/70">· {{ server.nickName }}</span>
                }
              </div>
              <div class="text-sm text-base-content/70 line-clamp-2" data-cy-id="server-description-text">
                {{ server.description || 'No description' }}
              </div>
            </div>
            <button type="button" class="btn btn-sm btn-ghost" [attr.aria-label]="'Edit ' + server.name"
                    (click)="editServer.emit(server)" data-cy-id="server-edit">
              <span class="material-icons text-[18px]" aria-hidden="true">edit</span>Edit
            </button>
          </li>
        } @empty {
          <li class="px-5 py-8 text-center text-base-content/70" data-cy-id="servers-none">No servers yet. They appear here after their first deployment.</li>
        }
      </ul>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServerList {
  readonly servers = input.required<IServer[]>()
  readonly selectedId = input<number | null>(null)
  readonly editServer = output<IServer>()
}
