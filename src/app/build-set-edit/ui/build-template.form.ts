import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {EditableBuildTemplate, IBranch, IProject} from "../../core";

@Component({
  selector: 'bb-build-template-form',
  template: `
    <div class="card shadow-sm">
      <div class="card-body">
        <div class="card-title">{{template.project.name}}</div>
        <form #templateForm="ngForm" (ngSubmit)="templateUpdated.emit(template)">
          <div class="flex flex-grow flex-row gap-2">
            <div class="basis-1/12">
              <div class="form-control">
                <input type="checkbox" [checked]="template.projectSelected" class="toggle toggle-success" (change)="projectSelection()"/>
              </div>
            </div>
            <div class="basis-11/12" [class.hidden]="!template.projectSelected">
              <div class="grid grid-cols-6 gap-3">
                <div class="form-control col-span-2">
                  <label class="label">
                    <span class="label-text">The Branch *</span>
                  </label>
                  <select class="select select-bordered select-sm w-full max-w-xs"
                          name="branch"
                          required
                          [compareWith]="compareBranch"
                          (change)="templateUpdated.emit(template)"
                          [(ngModel)]="template.branch"
                  >
                    <option *ngFor="let branch of template.project.branches" [ngValue]="branch">{{branch.name}}</option>
                  </select>
                </div>
                <div class="form-control col-span-2">
                  <label class="label" for="buildNumber">
                    <span class="label-text">Build Number</span>
                  </label>
                  <input id="buildNumber" class="input input-bordered input-sm" type="number" name="buildNumber" [(ngModel)]="template.buildNumber"
                         (change)="templateUpdated.emit(template)"
                  >
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  `,
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class BuildTemplateForm {
  @Input()
  template!: EditableBuildTemplate
  @Output()
  templateUpdated = new EventEmitter<EditableBuildTemplate>()
  @Output()
  projectAdded = new EventEmitter<IProject>();
  @Output()
  projectRemoved = new EventEmitter<IProject>();

  compareBranch(some: IBranch, other: IBranch): boolean {
    return some?.name === other?.name
  }

  selectedBranch(selected: IBranch, selectable: IBranch): boolean {
    return selected?.id === selectable?.id
  }

  projectSelection() {
    if (this.template.projectSelected) {
      this.projectRemoved.emit(this.template.project)
    } else {
      this.projectAdded.emit(this.template.project)
    }
  }

  updateTemplate(){

  }
}
