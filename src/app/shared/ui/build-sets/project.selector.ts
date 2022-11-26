import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from "@angular/core";
import {CommonModule} from "@angular/common";
import {MatListModule} from "@angular/material/list";
import {IProject} from "../../../core";

@Component({
  selector: 'bb-project-selector',
  template: `
    <mat-selection-list #selection>
      <mat-list-option *ngFor="let project of projects" (selectedChange)="projectSelectedChange.emit({project: project, selected:$event})">
        {{project.name}}
      </mat-list-option>
    </mat-selection-list>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, MatListModule]
})
export class ProjectSelector {
  @Input()
  projects!: IProject[]
  @Output()
  projectSelectedChange = new EventEmitter<{ project: IProject, selected: boolean }>();
}
