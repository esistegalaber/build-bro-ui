import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {select, Store} from "@ngrx/store";
import {alertState, theSideNavState} from "./core/state/selectors";
import {Buildz} from "./core";
import {clearAlert} from "./core/state/alerts/alert.actions";
import {loadBuildStats} from "./core/state/stats/stats.state";
import {CommonModule} from "@angular/common";
import {BuildBroToolbar} from "./ui/nav/build-bro.toolbar";
import {SidenavPanel} from "./ui/nav/sidenav.panel";
import {AlertPanel} from "./ui/alert.panel";
import {RouterModule} from "@angular/router";
import * as CoreActions from "./core/actions";

@Component({
  selector: 'bz-root',
  template: `
      <div class="container">
          <div>
              <bb-toolbar></bb-toolbar>
          </div>
          <div class="min-h-screen flex flex-row">
              <bz-sidenav [sideNav]="(sideNavState|async)!"></bz-sidenav>
              <main class="flex-grow min-w-0 overflow-auto p-1">
                  <bz-alert-panel (clearAlert)="clearAlert()" [alert]="(alert | async)!"></bz-alert-panel>
                  <router-outlet></router-outlet>
              </main>
          </div>
      </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule, BuildBroToolbar, SidenavPanel, AlertPanel, RouterModule
  ]
})
export class AppComponent implements OnInit {
  alert = this.store.pipe(select(alertState))
  sideNavState = this.store.pipe(select(theSideNavState))

  clearAlert(): void {
    this.store.dispatch(clearAlert())
  }

  constructor(private store: Store<Buildz>) {
    this.store.dispatch(loadBuildStats())
  }

  ngOnInit(): void {
    this.store.dispatch(CoreActions.loadProjects())
    this.store.dispatch(CoreActions.loadServers())
  }
}
