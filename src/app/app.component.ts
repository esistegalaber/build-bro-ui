import {ChangeDetectionStrategy, Component, OnInit, inject} from '@angular/core';
import {select, Store} from "@ngrx/store";
import {alertState, theSideNavState} from "./core/state/selectors";
import {Buildz} from "./core";
import {clearAlert} from "./core/state/alerts/alert.actions";
import {loadBuildStats} from "./core/state/stats/stats.state";
import {toggleSideNavState} from "./core/state/nav/nav.actions";
import {CommonModule} from "@angular/common";
import {SideNav} from "./ui/nav/side.nav";
import {AlertPanel} from "./ui/alert.panel";
import {RouterModule} from "@angular/router";
import * as CoreActions from "./core/actions";
import {Theme, ThemeService} from "./core/theme.service";

@Component({
  selector: 'bz-root',
  template: `
    @let nav = (sideNavState | async)!;
    <div class="min-h-screen flex flex-wrap bg-base-200 text-base-content">
      <bz-sidenav class="flex" [class.grow]="nav.text" [class.basis-60]="nav.text" [class.flex-none]="!nav.text"
                  [sideNav]="nav" [theme]="themeService.theme()"
                  (toggleLabels)="toggleSideNav()" (themeSelected)="selectTheme($event)"></bz-sidenav>
      <main class="grow-[999] basis-[560px] min-w-0 box-border px-6 py-8 lg:px-10">
        <div class="max-w-[1120px] mx-auto flex flex-col gap-6">
          <bz-alert-panel (clearAlert)="clearAlert()" [alert]="(alert | async)!"></bz-alert-panel>
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule, SideNav, AlertPanel, RouterModule
  ]
})
export class AppComponent implements OnInit {
  private store = inject<Store<Buildz>>(Store);
  protected themeService = inject(ThemeService);

  alert = this.store.pipe(select(alertState))
  sideNavState = this.store.pipe(select(theSideNavState))

  clearAlert(): void {
    this.store.dispatch(clearAlert())
  }

  toggleSideNav(): void {
    this.store.dispatch(toggleSideNavState())
  }

  selectTheme(theme: Theme): void {
    this.themeService.setTheme(theme)
  }

  constructor() {
    this.store.dispatch(loadBuildStats())
  }

  ngOnInit(): void {
    this.store.dispatch(CoreActions.loadProjects())
    this.store.dispatch(CoreActions.loadServers())
  }
}
