import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {IServer} from "../../core";

@Component({
  selector: 'bb-server-details-form',
  template: `
    @if (server != null) {
      <div class="container">
        <form (ngSubmit)="updateServer.emit(server)">
          <div class="grid grid-cols-1 gap-2">
            <div class="form-control">
              <label class="label">
                <span class="label-text">Description</span>
              </label>
              <textarea class="textarea textarea-primary" placeholder="Description" data-cy-id="server-description"
                name="description"
                [(ngModel)]="server.description"
              ></textarea>
            </div>
            <div class="form-control">
              <label class="label">
                <span class="label-text">Description</span>
              </label>
              <input class="input input-bordered input-sm" placeholder="Nick Name" data-cy-id="server-nickname"
                name="nickName"
                [(ngModel)]="server.nickName"
                />
            </div>
            <div class="flex justify-end">
              <button class="btn btn-primary" type="submit" data-cy-id="server-save">Save</button>
            </div>
          </div>
        </form>
      </div>
    }
    
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule
  ]
})
export class ServerDetailsForm {
  @Input()
  server: IServer | null = null
  @Output()
  updateServer = new EventEmitter<IServer>();
}
