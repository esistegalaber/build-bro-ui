import {ChangeDetectionStrategy, Component, inject} from "@angular/core";
import {select, Store} from "@ngrx/store";
import {Buildz} from "../core/state/model";
import {theBuildStats} from "../core/state/selectors";
import {CommonModule} from "@angular/common";
import {StatsHero} from "./ui/stats.hero";

@Component({
  template: `
    <bz-stats [stats]="(stats | async)!"></bz-stats>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    StatsHero
  ]
})
export class HomePage {
  private store = inject<Store<Buildz>>(Store);

  stats = this.store.pipe(select(theBuildStats))
}
