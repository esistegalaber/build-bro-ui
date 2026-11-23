import {ChangeDetectionStrategy, Component, inject} from "@angular/core";
import {select, Store} from "@ngrx/store";
import {allActiveProjects, Buildz, EditableBuildSetTemplate, EditableBuildTemplate, IProject, theLabelDefinitions} from "../core";
import {CommonModule} from "@angular/common";
import {theBuilds, theEditableBuildTemplates, theEditableTemplate, theTemplate} from "./state/edit-build-sets.selectors";
import * as EditBuildSetActions from "./state/edit-build-sets.actions";
import {navigateTo} from "./state/edit-build-sets.actions";
import {BuildSetNameForm} from "./ui/build-set-name.form";
import {BuildTemplateList} from "./ui/build-template.list";
import {ResolvedBuildsPanel} from "./ui/resolved-builds.panel";

@Component({
  template: `
    @let saved = (savedTemplate$ | async)!;
    @let templates = (EditableBuildTemplates$ | async)!;
    <div class="flex flex-col gap-6">
      <bb-build-set-name-form
        [editableTemplate]="(currentBuildSetTemplate$ | async)!"
        [savedName]="saved.id ? saved.name : null"
        [cloned]="saved.id === null"
        (save)="saveTemplate($event)"
      ></bb-build-set-name-form>
      <div class="flex flex-wrap items-start gap-6">
        <bb-build-template-list class="block min-w-0 grow-[999] basis-[560px]"
                                [templates]="templates" [labelDefinitions]="(labelDefinitions$ | async) ?? []"
                                (projectAdded)="projectAdded($event)"
                                (projectRemoved)="projectRemoved($event)"
                                (templateUpdated)="buildTemplateUpdated($event)"></bb-build-template-list>
        <bb-resolved-builds class="block min-w-0 grow basis-[300px] lg:sticky lg:top-6"
                            [builds]="(theBuilds$ | async)!" [templates]="templates"></bb-resolved-builds>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    BuildSetNameForm,
    BuildTemplateList,
    ResolvedBuildsPanel
  ]
})
export class EditBuildSetPage {
  private store = inject<Store<Buildz>>(Store);

  savedTemplate$ = this.store.pipe(select(theTemplate))
  currentBuildSetTemplate$ = this.store.pipe(select(theEditableTemplate))
  EditableBuildTemplates$ = this.store.pipe(select(theEditableBuildTemplates))
  projects$ = this.store.pipe(select(allActiveProjects))
  theBuilds$ = this.store.pipe(select(theBuilds))
  labelDefinitions$ = this.store.pipe(select(theLabelDefinitions))
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
}
