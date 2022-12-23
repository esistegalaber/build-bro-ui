import {ChangeDetectionStrategy, Component} from "@angular/core";
import {select, Store} from "@ngrx/store";
import {allActiveProjects, Buildz, CloningPipe, EditableBuildSetTemplate, EditableBuildTemplate, IProject} from "../core";
import {CommonModule} from "@angular/common";
import {BuildsAccordion} from "../ui/builds/builds.accordion";
import {BuildTemplateForm} from "./ui/build-template.form";
import {theBuilds, theEditableBuildTemplates, theEditableTemplate} from "./state/edit-build-sets.selectors";
import * as EditBuildSetActions from "./state/edit-build-sets.actions";
import {navigateTo} from "./state/edit-build-sets.actions";
import {BuildSetNameForm} from "./ui/build-set-name.form";
import {BuildSetAccordion} from "../ui/build-sets/build-set.accordion";

@Component({
  template: `
      <bb-build-set-name-form
              [editableTemplate]="(currentBuildSetTemplate$ | async)!"
              (save)="saveTemplate($event)"
      ></bb-build-set-name-form>
      <bb-build-template-form
              *ngFor="let buildTemplate of (EditableBuildTemplates$ | async | deepClone)!"
              [template]="buildTemplate"
              (projectAdded)="projectAdded($event)"
              (projectRemoved)="projectRemoved($event)"
              (templateUpdated)="buildTemplateUpdated($event)"
      >
      </bb-build-template-form>
      <bb-builds-accordion
              [builds]="(theBuilds$|async)!">
      </bb-builds-accordion>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    BuildsAccordion,
    BuildTemplateForm,
    BuildSetNameForm,
    BuildSetAccordion,
    CloningPipe
  ]
})
export class EditBuildSetPage {
  currentBuildSetTemplate$ = this.store.pipe(select(theEditableTemplate))
  EditableBuildTemplates$ = this.store.pipe(select(theEditableBuildTemplates))
  projects$ = this.store.pipe(select(allActiveProjects))
  theBuilds$ = this.store.pipe(select(theBuilds))
  visible = {
    projectSelector: false,
    branchSelector: false,
    verification: false,
    naming: false
  }

  projectAdded(project: IProject): void {
    this.store.dispatch(EditBuildSetActions.projectAdded({project}))
  }

  projectRemoved(project: IProject): void {
    this.store.dispatch(EditBuildSetActions.projectRemoved({project}))
  }

  buildTemplateUpdated(buildTemplate: EditableBuildTemplate): void {
    this.store.dispatch(EditBuildSetActions.buildTemplateUpdated({buildTemplate}))
  }

  saveTemplate(template: EditableBuildSetTemplate) {
    this.store.dispatch(EditBuildSetActions.saveWith({name: template.name}))
  }

  toNavState(navState: string) {
    this.store.dispatch(navigateTo({navState}))
  }

  constructor(private store: Store<Buildz>) {
  }
}
