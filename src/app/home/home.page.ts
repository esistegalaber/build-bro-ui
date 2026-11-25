import {ChangeDetectionStrategy, Component, inject} from "@angular/core";
import {AsyncPipe} from "@angular/common";
import {RouterLink} from "@angular/router";
import {select, Store} from "@ngrx/store";
import {Buildz} from "../core/state/model";
import {theBuildStats} from "../core/state/selectors";
import {allServers} from "../core/state/servers/server.selectors";
import {loadBuildStats} from "../core/state/stats/stats.state";
import {loadHome} from "./state/home.actions";
import {theHomeBuildSets, theRecentDeployments} from "./state/home.selectors";
import {StatCards} from "./ui/stat-cards";
import {RecentDeployments} from "./ui/recent-deployments";
import {HomeBuildSets} from "./ui/home-build-sets";

import {PageHeader} from '../ui/page-header'
@Component({
  template: `
    <div class="flex flex-col gap-8">
      <bb-page-header heading="Welcome back" description="Here is what Build Bruh knows about your builds.">
        <a class="btn btn-primary" routerLink="/builds" data-testid="browse-builds">
          <span class="material-icons text-[18px]" aria-hidden="true">search</span>Browse builds
        </a>
      </bb-page-header>

      <bb-stat-cards [stats]="(stats$ | async)!"></bb-stat-cards>

      <div class="grid grid-cols-[repeat(auto-fit,minmax(20rem,1fr))] items-start gap-6">
        <bb-recent-deployments [deployments]="(recentDeployments$ | async) ?? null"
                               [servers]="(servers$ | async) ?? []"></bb-recent-deployments>
        <bb-home-build-sets [buildSets]="(buildSets$ | async) ?? null"></bb-home-build-sets>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AsyncPipe, RouterLink, StatCards, RecentDeployments, HomeBuildSets, PageHeader]
})
export class HomePage {
  private store = inject<Store<Buildz>>(Store);

  stats$ = this.store.pipe(select(theBuildStats))
  servers$ = this.store.pipe(select(allServers))
  recentDeployments$ = this.store.pipe(select(theRecentDeployments))
  buildSets$ = this.store.pipe(select(theHomeBuildSets))

  constructor() {
    // fresh numbers whenever the page opens (the app loads them once on start, too)
    this.store.dispatch(loadBuildStats())
    this.store.dispatch(loadHome())
  }
}
