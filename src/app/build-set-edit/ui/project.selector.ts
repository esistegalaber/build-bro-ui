import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from "@angular/core";
import {CommonModule} from "@angular/common";
import {EditableBuildSetTemplate, IProject} from "../../core";

@Component({
  selector: 'bb-project-selector',
  template: `
    <div>
      <div *ngIf="selected">
        <button class="btn" (click)="projectRemoved.emit(project)">
          <span class="material-icons">check_box</span> {{project.name}}
        </button>
      </div>
      <div *ngIf="!selected">
        <button class="btn" (click)="projectAdded.emit(project)">
          <span class="material-icons">check_box_outline_blank</span> {{project.name}}
        </button>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule]
})
export class ProjectSelector {
  @Input()
  project!: IProject
  @Input()
  selected!: boolean
  @Output()
  projectAdded = new EventEmitter<IProject>();
  @Output()
  projectRemoved = new EventEmitter<IProject>();
}
