import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from "@angular/core";
import {CommonModule} from "@angular/common";
import {MatListModule, MatSelectionListChange} from "@angular/material/list";
import {EditableBuildSetTemplate, IProject} from "../../core";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'bb-project-selector',
  template: `
    <div class="grid grid-cols-1 gap-3">
      <ng-container *ngFor="let project of projects">
        <div *ngIf="isSelected(project)">
          <button mat-button (click)="projectRemoved.emit(project)">
            <mat-icon>check_box</mat-icon>
            {{project.name}}
          </button>
        </div>
        <div *ngIf="!isSelected(project)">
          <button mat-button (click)="projectAdded.emit(project)">
            <mat-icon *ngIf="!isSelected(project)">check_box_outline_blank</mat-icon>
            {{project.name}}
          </button>
        </div>
      </ng-container>


    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, MatListModule, MatCheckboxModule, MatIconModule, MatButtonModule]
})
export class ProjectSelector {
  @Input()
  projects!: IProject[]
  @Input()
  editableBuildSetTemplate!: EditableBuildSetTemplate;
  @Output()
  projectAdded = new EventEmitter<IProject>();
  @Output()
  projectRemoved = new EventEmitter<IProject>();

  isSelected(project: IProject): boolean {
    return this.editableBuildSetTemplate.projects.indexOf(project) > -1
  }
}
