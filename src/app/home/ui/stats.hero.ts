import {Component, Input} from '@angular/core'
import {IBuildStats} from '../../core'

@Component({
  selector: 'bz-stats',
  template: `
      <div class="hero min-h-screen bg-base-200 m-6" data-cy-id="stats-hero">
          <div class="hero-content text-center">
              <div class="max-w-md">
                  <h1 class="text-5xl font-bold">Build Bruh</h1>
                  <p class="py-6" i18n="@@hero.intro">
                      Proudly knowing stuff about the stuff you build.
                  </p>
                  <p>{{stats.numberOfProjects}} Projects</p>
                  <p>{{stats.numberOfBranches}} Branches</p>
                  <p>{{stats.numberOfBuilds}} Builds</p>
                  <p>{{stats.numberOfLabels}} Labels</p>
                  <p>{{stats.numberOfDeploys}} Deploys</p>
                  <button class="btn btn-primary">Browse</button>

              </div>
          </div>
      </div>
  `,
  standalone: true,
  imports: []
})
export class StatsHero {
  @Input()
  stats!: IBuildStats
}
