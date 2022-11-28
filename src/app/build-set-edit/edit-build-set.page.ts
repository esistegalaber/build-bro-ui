import {ChangeDetectionStrategy, Component} from "@angular/core";
import {select, Store} from "@ngrx/store";
import {allActiveProjects, Buildz, EditableBuildTemplate, IBuildTemplate, IProject} from "../core";
import {CommonModule} from "@angular/common";
import {CoreModule} from "../core/core.module";
import {BuildsAccordion} from "../ui/builds/builds.accordion";
import {BuildTemplateForm} from "../ui/build-sets/build-template.form";
import {MatStepperModule} from "@angular/material/stepper";
import {ProjectSelector} from "../ui/build-sets/project.selector";
import {theBuilds, theEditableBuildTemplates, theEditableTemplate} from "./state/edit-build-sets.selectors";
import * as EditBuildSetActions from "./state/edit-build-sets.actions";

@Component({
  template: `
    <h2>Edit BuildSet Template</h2>
    <mat-vertical-stepper [linear]="false" #stepper>
      <mat-step label="Select Projects for the BuildSet">
        <bb-project-selector
          [projects]="(projects$ | async)!"
          [editableBuildSetTemplate]="(currentBuildSetTemplate$ | async)!"
          (projectAdded)="projectAdded($event)"
          (projectRemoved)="projectRemoved($event)"
        ></bb-project-selector>
      </mat-step>
      <mat-step label="Builds">
        <bb-build-template-form
          *ngFor="let buildTemplate of (currentBuildTemplates$|async|deepClone)!"
          [template]="buildTemplate"
          (templateUpdated)="buildTemplateUpdated($event)"
        >

        </bb-build-template-form>
      </mat-step>
      <mat-step label="Verification">
        <bb-builds-accordion [builds]="(theBuilds$|async)!"></bb-builds-accordion>
      </mat-step>
    </mat-vertical-stepper>

    {{currentBuildSetTemplate$|async|json}}
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule, CoreModule, BuildsAccordion, BuildTemplateForm, MatStepperModule, ProjectSelector
  ]
})
export class EditBuildSetPage {
  currentBuildSetTemplate$ = this.store.pipe(select(theEditableTemplate))
  currentBuildTemplates$ = this.store.pipe(select(theEditableBuildTemplates))
  projects$ = this.store.pipe(select(allActiveProjects))
  theBuilds$ = this.store.pipe(select(theBuilds))

  projectAdded(project: IProject): void {
    this.store.dispatch(EditBuildSetActions.projectAdded({project}))
  }

  projectRemoved(project: IProject): void {
    this.store.dispatch(EditBuildSetActions.projectRemoved({project}))
  }

  buildTemplateUpdated(buildTemplate: EditableBuildTemplate): void {
    this.store.dispatch(EditBuildSetActions.buildTemplateUpdated({buildTemplate}))
  }

  constructor(private store: Store<Buildz>) {
  }
}
