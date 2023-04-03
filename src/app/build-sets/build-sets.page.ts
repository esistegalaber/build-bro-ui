import {ChangeDetectionStrategy, Component} from "@angular/core";
import {select, Store} from "@ngrx/store";
import {Buildz, IBuildSet, IBuildSetTemplate} from "../core";
import {theBuildSet, theBuildSetTemplateNames, theSelectedBuildSetName} from "./state/build-sets.selectors";
import {deleteBuildSetTemplate, loadBuildSetOf} from "./state/build-sets.actions";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {BuildsAccordion} from "../ui/builds/builds.accordion";
import {BuildSetAccordion} from "../ui/build-sets/build-set.accordion";
import {BuildSetNamesMenu} from "../ui/build-sets/build-set-names.menu";

@Component({
  template: `
    <div class="flex flex-row gap-2">
      <div class="basis-1/4 overflow-hidden">
        <bb-build-set-names-menu
          [names]="(names$ | async)!"
          [selectedName]="(theSelectedBuildSetName$|async)!"
          (buildSetSelected)="onBuildSetTemplateSelected($event)"
        ></bb-build-set-names-menu>
      </div>

      <div class="basis-3/4">
        <div class="flex justify-end">
          <a class="btn btn-circle" routerLink="/edit-build-set">
            <span class="material-icons">add</span>
          </a>
        </div>
        <bb-build-set-accordion [buildSet]="(theBuildSet$|async)!" (deleteBuildSet)="showDeleteBuildSetConfirmationDialog($event)"></bb-build-set-accordion>
      </div>
    </div>

    <!-- Put this part before </body> tag -->
    <input type="checkbox" id="delete-confirmation-dialog" class="modal-toggle" [checked]="showDeleteConfirmation"/>
    <div class="modal">
      <div class="modal-box relative">
        <label for="my-modal-3" class="btn btn-sm btn-circle absolute right-2 top-2" (click)="hideDeleteBuildSetConfirmationDialog()">✕</label>
        <h3 class="text-lg font-bold">Delete BuildSet</h3>
        <p class="py-4">Are you sure you eant to delete the BuildSet with name='{{toDelete.name}}' ?</p>
        <div class="modal-action">
          <a (click)="deleteBuildSetTemplate()" class="btn btn-danger">Delete It!</a>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    BuildsAccordion,
    BuildSetAccordion,
    BuildSetNamesMenu
  ]
})
export class BuildSetsPage {
  names$ = this.store.pipe(select(theBuildSetTemplateNames))
  theBuildSet$ = this.store.pipe(select(theBuildSet))
  theSelectedBuildSetName$ = this.store.pipe(select(theSelectedBuildSetName))
  showDeleteConfirmation = false
  toDelete: IBuildSet = <IBuildSet>{}

  onBuildSetTemplateSelected(templateName: string): void {
    this.store.dispatch(loadBuildSetOf({templateName}))
  }

  showDeleteBuildSetConfirmationDialog(buildSet: IBuildSet) {
    this.toDelete = buildSet;
    this.showDeleteConfirmation = true
  }

  hideDeleteBuildSetConfirmationDialog() {
    this.showDeleteConfirmation = false
  }

  deleteBuildSetTemplate() {
    this.store.dispatch(deleteBuildSetTemplate({name: this.toDelete?.name}))
    this.showDeleteConfirmation = false
  }

  constructor(private store: Store<Buildz>) {
  }
}
