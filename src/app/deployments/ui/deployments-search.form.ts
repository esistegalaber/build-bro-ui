import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from "@angular/core";
import {IDeploymentSearch, IServer} from "../../core";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'bb-deployments-search-form',
  template: `
    <form novalidate (submit)="updateSearch.emit(theSearch)" #searchForm="ngForm" aria-label="Filters"
          class="card bg-base-100 border border-base-300 shadow-sm">
      <div class="card-body flex-row flex-wrap items-end gap-3 p-5">
        <label class="flex grow basis-48 flex-col gap-1 text-xs font-semibold text-base-content/70">Server
          <select class="select select-sm w-full" name="serverName" data-cy-id="server-select"
                  [(ngModel)]="theSearch.serverName" (ngModelChange)="updateSearch.emit(theSearch)">
            <option value="">All servers</option>
            @for (server of servers; track server.id) {
              <option [value]="server.name">{{ server.name }}{{ server.nickName ? ' · ' + server.nickName : '' }}</option>
            }
          </select>
        </label>
        <label class="flex w-32 flex-col gap-1 text-xs font-semibold text-base-content/70">Per page
          <select class="select select-sm w-full" name="pageSize" data-cy-id="page-size-select"
                  [(ngModel)]="theSearch.pageSize" (ngModelChange)="updateSearch.emit(theSearch)">
            <option [value]="10">10</option>
            <option [value]="25">25</option>
            <option [value]="50">50</option>
          </select>
        </label>
        <div class="ms-auto flex gap-2">
          <button type="button" class="btn btn-sm btn-ghost" (click)="resetSearch.emit()" data-cy-id="search-reset">
            <span class="material-icons text-[18px]" aria-hidden="true">restart_alt</span>Reset
          </button>
          <button type="submit" class="btn btn-sm btn-primary" data-cy-id="search-reload">
            <span class="material-icons text-[18px]" aria-hidden="true">refresh</span>Reload
          </button>
        </div>
      </div>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule]
})
export class DeploymentsSearchForm {
  @Input()
  servers!: IServer[]
  @Input()
  theSearch!: IDeploymentSearch
  @Output()
  resetSearch = new EventEmitter<void>()
  @Output()
  updateSearch = new EventEmitter<IDeploymentSearch>()
}
