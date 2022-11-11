import {Component, Input} from '@angular/core'
import {IBuildStats} from '../../core'

@Component({
  selector: 'bz-stats',
  template: `
    <h4>
      <b>{{stats.numberOfProjects}}</b> Projects.
      <b>{{stats.numberOfBranches}}</b> Branches.
      <b>{{stats.numberOfBuilds}}</b> Builds.
      <b>{{stats.numberOfLabels}}</b> Labels.
      <b>{{stats.numberOfDeploys}}</b> Deploys.
    </h4>
  `
})
export class StatsPanel {
  @Input()
  stats!: IBuildStats
}
