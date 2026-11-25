import {ChangeDetectionStrategy, Component, computed, input} from '@angular/core'
import {RouterLink} from '@angular/router'
import {DateFnsModule} from 'ngx-date-fns'
import {IBuild, IDeployment, IServer} from '../../core'

/** How many build chips a deployment shows before it summarizes the rest as "+n more". */
export const VISIBLE_BUILDS = 3

interface DeploymentRow {
  deployment: IDeployment
  nickName: string | null
  builds: IBuild[]
  moreBuilds: number
}

/** The newest deployments: server, when, and which builds (summarized when there are many). */
import {Loading} from '../../ui/loading'
@Component({
  selector: 'bb-recent-deployments',
  template: `
    <section class="card bg-base-100 border border-base-300 shadow-sm" aria-label="Recent deployments">
      <div class="card-body gap-2 p-5">
        <div class="flex items-center justify-between gap-2">
          <h2 class="text-lg font-bold">Recent deployments</h2>
          <a routerLink="/deployments" class="link link-hover link-primary text-sm font-semibold" data-testid="home-all-deployments">View all</a>
        </div>
        @if (rows(); as rows) {
          @for (row of rows; track row.deployment.id) {
            <div class="flex flex-wrap items-center gap-3 border-t border-base-300 py-3" attr.data-testid="home-deployment-{{row.deployment.id}}">
              <span class="size-9 shrink-0 rounded-xl bg-base-200 text-base-content/70 grid place-items-center" aria-hidden="true">
                <span class="material-icons text-[18px]">dns</span>
              </span>
              <div class="min-w-40 grow">
                <div class="font-semibold">{{ row.deployment.serverName }}
                  @if (row.nickName) {
                    <span class="font-medium text-base-content/70">· {{ row.nickName }}</span>
                  }
                </div>
                <div class="text-sm text-base-content/70" [title]="row.deployment.deployedAt | dfnsParseIso | dfnsFormat: 'PPpp'">
                  {{ row.deployment.deployedAt | dfnsParseIso | dfnsFormatDistanceToNowPure }} ago
                </div>
              </div>
              <div class="min-w-0 text-sm text-base-content/70">
                @for (build of row.builds; track build.id; let last = $last) {
                  <span class="font-mono">{{ build.project }} #{{ build.buildNumber }}</span>{{ last && row.moreBuilds === 0 ? '' : ', ' }}
                }
                @if (row.moreBuilds > 0) {
                  <span data-testid="home-deployment-more">+{{ row.moreBuilds }} more</span>
                }
              </div>
            </div>
          } @empty {
            <p class="border-t border-base-300 py-6 text-center text-base-content/70" data-testid="home-deployments-none">No deployments yet.</p>
          }
        } @else {
          <bb-loading class="border-t border-base-300"></bb-loading>
        }
      </div>
    </section>
  `,
  imports: [RouterLink, DateFnsModule, Loading],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecentDeployments {
  /** null while loading */
  readonly deployments = input.required<IDeployment[] | null>()
  readonly servers = input<IServer[]>([])

  readonly rows = computed((): DeploymentRow[] | null => this.deployments()?.map((deployment) => ({
    deployment,
    nickName: this.servers().find((s) => s.name === deployment.serverName)?.nickName ?? null,
    builds: deployment.builds.slice(0, VISIBLE_BUILDS),
    moreBuilds: Math.max(0, deployment.builds.length - VISIBLE_BUILDS)
  })) ?? null)
}
