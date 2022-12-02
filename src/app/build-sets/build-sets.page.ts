import {ChangeDetectionStrategy, Component} from "@angular/core";
import {select, Store} from "@ngrx/store";
import {Buildz} from "../core";
import {theBuildSet, theBuildSetTemplateNames, theSelectedBuildSetName} from "./state/build-sets.selectors";
import {loadBuildSetOf} from "./state/build-sets.actions";
import {CommonModule} from "@angular/common";
import {CoreModule} from "../core/core.module";
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
        <bb-build-set-accordion [buildSet]="(theBuildSet$|async)!"></bb-build-set-accordion>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    CoreModule,
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

  onBuildSetTemplateSelected(templateName: string): void {
    this.store.dispatch(loadBuildSetOf({templateName}))
  }

  newBuildSetTemplate(): void {
    console.log("New BuildSets")
  }

  constructor(private store: Store<Buildz>) {
  }
}
