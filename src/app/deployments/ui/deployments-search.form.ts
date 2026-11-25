import {ChangeDetectionStrategy, Component, input, output} from '@angular/core'
import {form, FormField, FormRoot} from '@angular/forms/signals'
import {IDeploymentSearch, IServer} from '../../core'
import {storeDraft} from '../../ui/forms/store-draft'

/** The filters of the deployments search: a Signal Form on a draft of the store's search. */
@Component({
  selector: 'bb-deployments-search-form',
  template: `
    <form [formRoot]="searchForm" aria-label="Filters" class="card bg-base-100 border border-base-300 shadow-sm">
      <div class="card-body flex-row flex-wrap items-end gap-3 p-5">
        <label class="flex grow basis-48 flex-col gap-1 text-xs font-semibold text-base-content/70">Server
          <select class="select select-sm w-full" data-testid="server-select" [formField]="searchForm.serverName">
            <option value="">All servers</option>
            @for (server of servers(); track server.id) {
              <option [value]="server.name">{{ server.name }}{{ server.nickName ? ' · ' + server.nickName : '' }}</option>
            }
          </select>
        </label>
        <label class="flex w-32 flex-col gap-1 text-xs font-semibold text-base-content/70">Per page
          <!-- a native select only binds to text fields, and the page size is a number -->
          <select class="select select-sm w-full" data-testid="page-size-select" (change)="choosePageSize($event)">
            @for (size of pageSizes; track size) {
              <option [value]="size" [selected]="size === model().pageSize">{{ size }}</option>
            }
          </select>
        </label>
        <div class="ms-auto flex gap-2">
          <button type="button" class="btn btn-sm btn-ghost" (click)="resetSearch.emit()" data-testid="search-reset">
            <span class="material-icons text-[18px]" aria-hidden="true">restart_alt</span>Reset
          </button>
          <button type="submit" class="btn btn-sm btn-primary" data-testid="search-reload">
            <span class="material-icons text-[18px]" aria-hidden="true">refresh</span>Reload
          </button>
        </div>
      </div>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormRoot, FormField]
})
export class DeploymentsSearchForm {
  readonly servers = input<IServer[]>([])
  readonly theSearch = input.required<IDeploymentSearch>()
  readonly resetSearch = output<void>()
  readonly updateSearch = output<IDeploymentSearch>()

  readonly pageSizes = [10, 25, 50]

  private readonly draft = storeDraft(() => this.theSearch(), (search) => this.updateSearch.emit(search))
  readonly model = this.draft.model
  readonly searchForm = form(this.model, {
    submission: {action: async () => this.draft.send(this.model())}
  })

  choosePageSize(event: Event): void {
    const pageSize = Number((event.target as HTMLSelectElement).value)
    this.model.update((search) => ({...search, pageSize}))
  }
}
