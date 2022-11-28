import {ChangeDetectionStrategy, Component, EventEmitter, Input} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {MatStepperModule} from "@angular/material/stepper";
import {IBuildTemplate, IProject} from "../../core";

@Component({
  selector: 'bb-build-set-template-form',
  template: `
    <mat-vertical-stepper [linear]="false" #stepper>
      <mat-step label="Projects">
        <div class="col-2" *ngFor="let project of projects">
          <div class="form-check align-middle">
            <input class="form-check-input" type="checkbox"
                   value="{{project.name}}">
            <!--                   [checked]="hasArtifactOf(project.name)" id="{{project.name}}"-->
            <!--                   (click)="toggleProject.emit(project.name)"-->

            <label class="form-check-label" for="{{project.name}}">
              {{project.name}}
            </label>
          </div>
        </div>
      </mat-step>
      <mat-step label="Builds">
        Step Content
      </mat-step>
      <mat-step label="Verification">
        Step Content
      </mat-step>
    </mat-vertical-stepper>
  `,
  standalone: true,
  imports: [CommonModule, FormsModule, MatStepperModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class BuildSetTemplateForm {
  @Input()
  projects!: IProject[]
}
