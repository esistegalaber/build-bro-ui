import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from "@angular/core";
import {EditableBuildSetTemplate} from "../../core";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'bb-build-set-name-form',
  template: `
      <form #theForm="ngForm">
          <div class="grid grid-cols-12 itms-end">
              <div class="form-control col-span-4">
                  <label class="label" for="templateName">
                      <span class="label-text">Name</span>
                  </label>
                  <input name="templateName" required type="text" placeholder="Name of your BuildSet"
                         class="input input-bordered input-sm" data-cy-id="build-set-name-input"
                         [(ngModel)]="editableTemplate.name"
                         #templateName="ngModel"
                  >
              </div>
              <div class="col-span-4 self-end">
                  <button class="btn btn-sm sm-primary" (click)="save.emit(editableTemplate)" [disabled]="theForm.invalid" data-cy-id="build-set-save">
                      <span class="material-icons">save</span>
                      Save
                  </button>
              </div>
          </div>
      </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule
  ]
})
export class BuildSetNameForm {
  @Input()
  editableTemplate!: EditableBuildSetTemplate
  @Output()
  save = new EventEmitter<EditableBuildSetTemplate>();
}
