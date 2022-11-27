import {ChangeDetectionStrategy, Component} from "@angular/core";
import {select, Store} from "@ngrx/store";
import {Buildz} from "../core";
import {theBuildSet, theBuildSetTemplateNames} from "./state/build-sets.selectors";
import {loadBuildSetOf} from "./state/build-sets.actions";
import {CommonModule} from "@angular/common";
import {CoreModule} from "../core/core.module";
import {ListComponent} from "../shared/ui/generic/list.component";
import {RouterModule} from "@angular/router";
import {MatIconModule} from "@angular/material/icon";
import {BuildsAccordion} from "../shared/ui/builds/builds.accordion";
import {MatButtonModule} from "@angular/material/button";
import {BuildSetAccordion} from "../shared/ui/build-sets/build-set.accordion";

@Component({
  template: `
    <h2>Build Sets</h2>
    <div class="flex flex-row gap-2">
      <div class="basis-1/4 overflow-hidden">
        <bb-list
          [data]="(names$ | async)!"
          (selected)="onBuildSetTemplateSelected($event)"
        >
        </bb-list>
      </div>

      <div class="basis-2/3">
        <div class="flex flex-row-reverse mb-4">
          <button mat-fab [routerLink]="['/new-build-set']">
            <mat-icon>add_circle</mat-icon>
          </button>
        </div>
        <bb-build-set-accordion [buildSet]="(theBuildSet$|async)!"></bb-build-set-accordion>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule, CoreModule, ListComponent, RouterModule, MatIconModule, BuildsAccordion, MatButtonModule, BuildSetAccordion
  ]
})
export class BuildSetsPage {
  names$ = this.store.pipe(select(theBuildSetTemplateNames))
  theBuildSet$ = this.store.pipe(select(theBuildSet))

  onBuildSetTemplateSelected(templateName: string): void {
    this.store.dispatch(loadBuildSetOf({templateName}))
  }

  newBuildSetTemplate(): void {
    console.log("New BuildSets")
  }

  constructor(private store: Store<Buildz>) {
  }
}
