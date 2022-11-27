import {ChangeDetectionStrategy, Component} from "@angular/core";
import {select, Store} from "@ngrx/store";
import {Buildz} from "../core/state/model";
import {theBuildStats} from "../core/state/selectors";
import {CommonModule} from "@angular/common";
import {StatsPanel} from "./ui/stats.panel";

@Component({
  template: `
    <bz-stats [stats]="(stats | async)!"></bz-stats>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    StatsPanel
  ]
})
export class HomePage {
  stats = this.store.pipe(select(theBuildStats))

  constructor(private store: Store<Buildz>) {
  }
}
