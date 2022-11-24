import {Component} from '@angular/core';
import {select, Store} from "@ngrx/store";
import {alertState, theSideNavState} from "./core/state/selectors";
import {Buildz} from "./core";
import {clearAlert} from "./core/state/alerts/alert.actions";
import {loadBuildStats} from "./core/state/stats/stats.state";

@Component({
  selector: 'bz-root',
  template: `
    <bb-toolbar></bb-toolbar>
    <div class="min-h-screen flex">
      <nav class="shrink">
        <bz-sidenav [sideNav]="(sideNavState|async)!"></bz-sidenav>
      </nav>
      <main class="flex-grow min-w-0 overflow-auto p-2">
        <bz-alert-panel (clearAlert)="clearAlert()" [alert]="(alert | async)!"></bz-alert-panel>
        <router-outlet></router-outlet>
      </main>
    </div>
  `
})
export class AppComponent {
  title = 'build-bro-ui';
  alert = this.store.pipe(select(alertState))
  sideNavState = this.store.pipe(select(theSideNavState))

  clearAlert(): void {
    this.store.dispatch(clearAlert())
  }

  constructor(private store: Store<Buildz>) {
    this.store.dispatch(loadBuildStats())
  }
}
