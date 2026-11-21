import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from "@angular/core";
import {IBuildLabel} from "../../core";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'bb-build-label-input',
  template: `
      <form #buildLabelForm="ngForm">
          <div class="grid grid-cols-12">
              <div class="col-span-4">
                  <input class="input input-sm" type="text" placeholder="Key" name="theKey"
                         required
                         [(ngModel)]="key"
                  >
              </div>
              <div class="col-span-4">
                  <input class="input input-sm" type="text" placeholder="Value" name="theValue"
                         required
                         [(ngModel)]="value">
              </div>
              <div class="col-span-4">
                  <button [disabled]="buildLabelForm.invalid" class="btn btn-sm btn-neutral" (click)="add.emit({key, value})">
                      <span class="material-icons">add</span>
                  </button>
              </div>
          </div>
      </form>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    FormsModule
  ]
})
export class BuildLabelInput {
  @Input()
  key: string | null = null
  @Input()
  value: string | null = null
  @Output()
  add = new EventEmitter<{ key: string | null, value: string | null }>()
}
