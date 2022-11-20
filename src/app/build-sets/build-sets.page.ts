import {ChangeDetectionStrategy, Component} from "@angular/core";
import {select, Store} from "@ngrx/store";
import {Buildz} from "../core";
import {theBuildSetTemplateNames, theBuildsOfBuildSet, theCurrentBuildSetName} from "./state/build-sets.selectors";
import {loadBuildSetOf} from "./state/build-sets.actions";

@Component({
  template: `
    <div class="row">
      <div class="col-3">
        <bb-card title="Defined Templates">
          <bb-list
            [data]="(names$ | async)!"
            (selected)="onBuildSetTemplateSelected($event)"
          >
          </bb-list>
        </bb-card>
<!--        <bz-build-set-template-list-->
<!--          [templateNames]="(names$ | async)!"-->
<!--          (templateSelected)="onBuildSetTemplateSelected($event)"-->
<!--          (newBuildSetTemplate)="newBuildSetTemplate()"-->
<!--        >-->
<!--        </bz-build-set-template-list>-->
      </div>
      <div class="col-9">
        <bb-card [title]="'Builds of ' + (buildSetName$ | async)!">
          <bz-builds-accordion
            [builds]="(buildOf$ | async)!"
          >
          </bz-builds-accordion>
        </bb-card>
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
