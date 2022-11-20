import {ChangeDetectionStrategy, Component} from "@angular/core";
import {Store} from "@ngrx/store";
import {Buildz} from "../core";

@Component({
  template: `
    <div class="row">
      NEW
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewBuildSetPage {

  constructor(private store: Store<Buildz>) {
  }
}
