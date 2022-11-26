import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {IBuildTemplate} from "../../../core";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {MatCardModule} from "@angular/material/card";

@Component({
  selector: 'bb-build-template-form',
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Build for Project {{template.project.name}}</mat-card-title>
      </mat-card-header>
      <mat-form-field>
        <mat-label>Branches</mat-label>
        <mat-select [(value)]="template.branch" (selectionChange)="templateUpdated.emit(template)">
          <mat-option [value]="null">Any</mat-option>
          <mat-option *ngFor="let branch of template.project.branches" [value]="branch.name">{{branch.name}}</mat-option>
        </mat-select>
      </mat-form-field>
    </mat-card>
  `,
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatSelectModule, MatCardModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class BuildTemplateForm {
  @Input()
  template!: IBuildTemplate
  @Output()
  templateUpdated = new EventEmitter<IBuildTemplate>()
}
