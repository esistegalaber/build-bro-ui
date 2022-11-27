import {ChangeDetectionStrategy, Component} from "@angular/core";
import {select, Store} from "@ngrx/store";
import {allActiveProjects, Buildz, IBuildTemplate, IProject} from "../core";
import {CommonModule} from "@angular/common";
import {CoreModule} from "../core/core.module";
import {BuildsAccordion} from "../shared/ui/builds/builds.accordion";
import {BuildTemplateForm} from "../shared/ui/build-sets/build-template.form";
import {MatStepperModule} from "@angular/material/stepper";
import {ProjectSelector} from "../shared/ui/build-sets/project.selector";
import {theBuilds, theBuildTemplates, theTemplate} from "./state/edit-build-sets.selectors";
import * as EditBuildSetActions from "./state/edit-build-sets.actions";

@Component({
  template: `
    <h2>Edit BuildSet Template</h2>
    <mat-vertical-stepper [linear]="false" #stepper>
      <mat-step label="Select Projects for the BuildSet">
        <bb-project-selector
          [projects]="(projects$ | async)!"
          (projectSelectedChange)="projectSelected($event.project, $event.selected)"
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
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule, CoreModule, BuildsAccordion, BuildTemplateForm, MatStepperModule, ProjectSelector
  ]
})
export class EditBuildSetPage {
  currentBuildSetTemplate$ = this.store.pipe(select(theTemplate))
  currentBuildTemplates$ = this.store.pipe(select(theBuildTemplates))
  projects$ = this.store.pipe(select(allActiveProjects))
  theBuilds$ = this.store.pipe(select(theBuilds))

  projectSelected(project: IProject, selected: boolean): void {
    this.store.dispatch(EditBuildSetActions.changeProjectSelection({project, selected}))
  }

  buildTemplateUpdated(buildTemplate: IBuildTemplate): void {
    this.store.dispatch(EditBuildSetActions.buildTemplateUpdated({buildTemplate}))
  }

  constructor(private store: Store<Buildz>) {
  }
}
