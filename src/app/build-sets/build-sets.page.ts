import {ChangeDetectionStrategy, Component} from "@angular/core";
import {select, Store} from "@ngrx/store";
import {Buildz} from "../core";
import {theBuildSetTemplateNames, theBuildsOfBuildSet, theCurrentBuildSetName} from "./state/build-sets.selectors";
import {loadBuildSetOf} from "./state/build-sets.actions";

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
          <button mat-fab [routerLink]="['new']">
            <mat-icon>add_circle</mat-icon>
          </button>
        </div>
        <bb-builds-accordion [builds]="(buildOf$|async)!"></bb-builds-accordion>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BuildSetsPage {
  names$ = this.store.pipe(select(theBuildSetTemplateNames))
  buildOf$ = this.store.pipe(select(theBuildsOfBuildSet))
  buildSetName$ = this.store.pipe(select(theCurrentBuildSetName))

  onBuildSetTemplateSelected(templateName: string): void {
    this.store.dispatch(loadBuildSetOf({templateName}))
  }

  newBuildSetTemplate(): void {
    console.log("New BuildSets")
  }

  constructor(private store: Store<Buildz>) {
  }
}
