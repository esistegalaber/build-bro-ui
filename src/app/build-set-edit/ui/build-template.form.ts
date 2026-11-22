import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {EditableBuildTemplate, IBranch, IProject} from "../../core";
import {formatLabels, parseLabels} from "../state/utils";

/**
 * One project of the build set as a compact row: switch, name, and, when the project is included, its branch,
 * build number (empty: the latest) and label filter. An excluded project is a single muted line.
 */
@Component({
  selector: 'bb-build-template-form',
  template: `
    <div class="flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-base-300 px-5 py-3"
         [class.text-base-content/60]="!template.projectSelected" attr.data-cy-id="build-template-{{template.project.name}}">
      <input type="checkbox" class="toggle toggle-success toggle-sm" [checked]="template.projectSelected" (change)="projectSelection()"
             [attr.aria-label]="'Include ' + template.project.name" data-cy-id="project-toggle"/>
      <div class="flex min-w-0 grow basis-28 flex-wrap items-center gap-2">
        <span [class.font-semibold]="template.projectSelected">{{ template.project.name }}</span>
        @if (template.projectSelected && template.buildNumber != null) {
          <span class="badge badge-soft badge-warning badge-sm" data-cy-id="template-pinned">pinned</span>
        }
      </div>
      @if (template.projectSelected) {
        <select class="select select-sm w-36 grow sm:grow-0" data-cy-id="template-branch-select"
                [attr.aria-label]="'Branch of ' + template.project.name"
                [compareWith]="compareBranch" [(ngModel)]="template.branch" [ngModelOptions]="{standalone: true}"
                (change)="templateUpdated.emit(template)">
          <option [ngValue]="null">Choose a branch</option>
          @for (branch of template.project.branches; track branch.id) {
            <option [ngValue]="branch">{{ branch.name }}</option>
          }
        </select>
        <input class="input input-sm w-24 font-mono" type="number" min="1" name="buildNumber" placeholder="latest"
               [attr.aria-label]="'Build number of ' + template.project.name + ', empty for the latest'"
               [(ngModel)]="template.buildNumber" [ngModelOptions]="{standalone: true}" (change)="templateUpdated.emit(template)">
        <input class="input input-sm w-36 grow sm:grow-0" type="text" name="labels" placeholder="key=value"
               [attr.aria-label]="'Label filter of ' + template.project.name + ', as key=value, key=value'"
               [value]="labelText" (change)="labelsChanged($any($event.target).value)" data-cy-id="template-labels">
      } @else {
        <span class="w-[25.5rem] max-w-full text-sm">Not included</span>
      }
    </div>
  `,
  imports: [FormsModule],
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

  get labelText(): string {
    return formatLabels(this.template.labels)
  }

  compareBranch(some: IBranch | null, other: IBranch | null): boolean {
    return some?.name === other?.name
  }

  labelsChanged(text: string): void {
    this.template.labels = parseLabels(text)
    this.templateUpdated.emit(this.template)
  }

  projectSelection() {
    if (this.template.projectSelected) {
      this.projectRemoved.emit(this.template.project)
    } else {
      this.projectAdded.emit(this.template.project)
    }
  }
}
