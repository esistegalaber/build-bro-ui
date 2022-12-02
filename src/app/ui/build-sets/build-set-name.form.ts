import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from "@angular/core";
import {CommonModule} from "@angular/common";
import {MatCardModule} from "@angular/material/card";
import {EditableBuildSetTemplate} from "../../core";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {FormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";

@Component({
  selector: 'bb-build-set-name',
  template: `
    <form #theForm="ngForm">
      <mat-card>
        <mat-card-header>
          <mat-card-title></mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <mat-form-field>
            <input name="editableTemplate.name" required matInput type="text" placeholder="Name ror your BuildSet"
                   [(ngModel)]="editableTemplate.name"
                   #templateName="ngModel"
            >
            <mat-error *ngIf="templateName.errors?.['required']">Please give the BuildSet Template some name.</mat-error>
          </mat-form-field>
        </mat-card-content>
        <mat-card-actions>
          <button mat-button color="primary" (click)="save.emit(editableTemplate)" [disabled]="theForm.invalid">
            <mat-icon>save</mat-icon>
            Save
          </button>
        </mat-card-actions>
      </mat-card>
    </form>

  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class BuildSetNameForm {
  @Input()
  editableTemplate!: EditableBuildSetTemplate
  @Output()
  save = new EventEmitter<EditableBuildSetTemplate>();
}
