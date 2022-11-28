import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {EditableBuildTemplate, IBranch, IBuildTemplate} from "../../core";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {MatCardModule} from "@angular/material/card";
import {MatInputModule} from "@angular/material/input";

@Component({
  selector: 'bb-build-template-form',
  template: `
    <div class="container p-1">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Build for Project "{{template.project.name}}"</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="grid grid-rows-1">
            <mat-form-field>
              <mat-label>Branches ({{template.project.branches.length}})</mat-label>
              <mat-select [(ngModel)]="template.branch" (selectionChange)="templateUpdated.emit(template)" [compareWith]="selectedBranch">
                <mat-option *ngFor="let branch of template.project.branches" [value]="branch">{{branch.name}}</mat-option>
              </mat-select>
            </mat-form-field>
            <mat-form-field>
              <mat-label>Specific BuildNumber</mat-label>
              <input matInput type="number" [(ngModel)]="template.buildNumber" (change)="templateUpdated.emit(template)">
            </mat-form-field>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatSelectModule, MatCardModule, MatInputModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class BuildTemplateForm {
  @Input()
  template!: EditableBuildTemplate
  @Output()
  templateUpdated = new EventEmitter<EditableBuildTemplate>()

  selectedBranch(selected: IBranch, selectable: IBranch): boolean {
    return selected?.id === selectable?.id
  }
}
