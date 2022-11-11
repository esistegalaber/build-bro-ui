import {Component} from '@angular/core';
import {select, Store} from "@ngrx/store";
import {alertState} from "./core/state/selectors";
import {Buildz} from "./core/state/model";
import {clearAlert} from "./core/state/alerts/alert.actions";
import {loadBuildStats} from "./core/state/stats/stats.state";

@Component({
  selector: 'bz-root',
  template: `
    <bz-navbar></bz-navbar>
    <div class="row">
      <bz-alert-panel (clearAlert)="clearAlert()" [alert]="(alert | async)!"></bz-alert-panel>
      <div class="col-sm col-sm-auto">
        <bz-sidenav></bz-sidenav>
      </div>
      <div class="col flex-grow-1">
        <div class="row">
          <div class="col p-2">
            <router-outlet></router-outlet>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AppComponent {
  title = 'build-bro-ui';
  alert = this.store.pipe(select(
    alertState
  ))

  clearAlert(): void {
    this.store.dispatch(
      clearAlert()
    )
  }

  constructor(private store: Store<Buildz>) {
    this.store.dispatch(loadBuildStats())
  }
}
