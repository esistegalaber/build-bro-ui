import {ChangeDetectionStrategy, Component} from "@angular/core";
import {Store} from "@ngrx/store";
import {Buildz} from "../core";

@Component({
  template: `
    <h2>Edit BuildSet Template</h2>
    <mat-vertical-stepper [linear]="false" #stepper>
      <mat-step label="Projects">
        Step Content
      </mat-step>
      <mat-step label="Builds">
        Step Content
      </mat-step>
      <mat-step label="Verification">
        Step Content
      </mat-step>
    </mat-vertical-stepper>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditBuildSetPage {

  constructor(private store: Store<Buildz>) {
  }
}
