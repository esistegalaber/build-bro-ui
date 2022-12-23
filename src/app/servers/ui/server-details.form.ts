import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {IServer} from "../../core";

@Component({
  selector: 'bb-server-details-form',
  template: `
    <div class="container" *ngIf="server != null">

      <form (ngSubmit)="updateServer.emit(server)">
        <div class="grid grid-cols-1 gap-2">
          <div class="form-control">
            <label class="label">
              <span class="label-text">Description</span>
            </label>
            <textarea class="textarea textarea-primary" placeholder="Description"
                      name="description"
                      [(ngModel)]="server.description"
            ></textarea>
          </div>
          <div class="form-control">
            <label class="label">
              <span class="label-text">Description</span>
            </label>
            <input class="input input-bordered input-sm" placeholder="Nick Name"
                   name="nickName"
                   [(ngModel)]="server.nickName"
            />
          </div>
          <div class="flex justify-end">
            <button class="btn btn-primary" type="submit">Save</button>
          </div>
        </div>
      </form>

    </div>

  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule, FormsModule
  ]
})
export class ServerDetailsForm {
  @Input()
  server: IServer | null = null
  @Output()
  updateServer = new EventEmitter<IServer>();
}
