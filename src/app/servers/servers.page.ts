import {ChangeDetectionStrategy, Component} from "@angular/core";
import {select, Store} from "@ngrx/store";
import {Buildz, CloningPipe, IServer} from "../core";
import {CommonModule} from "@angular/common";
import {allServers} from "../core/state/servers/server.selectors";
import {FormsModule} from "@angular/forms";
import {deepClone} from "../core/util/deep-clone";
import {ServerDetailsForm} from "./ui/server-details.form";
import * as CoreActions from "../core/actions";

@Component({
  template: `
      <div class="grid grid-cols-2 gap-2">
          <table class="table table-compact table-zebra w-full">
              <thead>
              <tr>
                  <td>ID</td>
                  <td>Name</td>
                  <td>Nick Name</td>
                  <td></td>
              </tr>
              </thead>
              <tr *ngFor="let server of allServers$|async">
                  <td>{{server.id}}</td>
                  <td>{{server.name}}</td>
                  <td>{{server.nickName || '---'}}</td>
                  <td>
                      <button class="btn btn-ghost" (click)="select(server)">Edit</button>
                  </td>
              </tr>
          </table>
          <bb-server-details-form
                  [server]="selectedServer"
                  (updateServer)="updateSingleServer($event)"
          >
          </bb-server-details-form>
      </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ServerDetailsForm,
    CloningPipe
  ]
})
export class ServersPage {
  allServers$ = this.store.pipe(select(allServers))
  selectedServer: IServer | null = null

  select(server: IServer | null) {
    this.selectedServer = deepClone(server)
  }

  updateSingleServer(server: IServer) {
    this.store.dispatch(CoreActions.updateServer({server}))
    this.selectedServer = null;
  }

  constructor(private store: Store<Buildz>) {
  }
}
