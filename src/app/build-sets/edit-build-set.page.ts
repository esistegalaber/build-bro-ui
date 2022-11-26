import {ChangeDetectionStrategy, Component} from "@angular/core";
import {select, Store} from "@ngrx/store";
import {Buildz, IBuildTemplate, IProject} from "../core";
import {allProjects, theCurrentBuildSetTemplate, theCurrentBuildTemplates} from "./state/build-sets.selectors";
import {buildTemplateUpdated, changeProjectSelection} from "./state/build-sets.actions";

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
        <div *ngFor="let buildTemplate of (currentBuildTemplates$|async|deepClone)!">
          <bb-build-template-form
            [template]="buildTemplate"
            (templateUpdated)="buildTemplateUpdated($event)"
          >

          </bb-build-template-form>
        </div>
      </mat-step>
      <mat-step label="Verification">
        Step Content
      </mat-step>
    </mat-vertical-stepper>

    {{currentBuildTemplates$ |async| json}}
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditBuildSetPage {
  currentBuildSetTemplate$ = this.store.pipe(select(theCurrentBuildSetTemplate))
  currentBuildTemplates$ = this.store.pipe(select(theCurrentBuildTemplates))
  projects$ = this.store.pipe(select(allProjects))

  projectSelected(project: IProject, selected: boolean): void {
    this.store.dispatch(changeProjectSelection({project, selected}))
  }

  buildTemplateUpdated(buildTemplate: IBuildTemplate): void {
    this.store.dispatch(buildTemplateUpdated({buildTemplate}))
  }

  constructor(private store: Store<Buildz>) {
  }
}
