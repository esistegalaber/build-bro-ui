import {ChangeDetectionStrategy, Component, computed, input} from '@angular/core'
import {DateFnsModule} from 'ngx-date-fns'
import {IDeployment, IServer} from '../../core'
import {BuildsAccordion} from '../builds/builds.accordion'

interface DeploymentRow {
  deployment: IDeployment
  nickName: string | null
}

/**
 * One row per deployment: server (and nickname), when (relative and exact), how many builds, and its labels.
 * A row expands to list its builds, so even a deployment of many builds stays one line until opened.
 */
@Component({
  selector: 'bb-deployment-list',
  template: `
    @for (row of rows(); track row.deployment.id) {
      <div class="collapse collapse-arrow rounded-none border-b border-base-300 last:border-b-0" data-cy-id="row-of-deployment">
        <input type="checkbox" attr.data-cy-id="deployment-{{row.deployment.id}}"
               [attr.aria-label]="'Show the builds of the deployment to ' + row.deployment.serverName"/>
        <div class="collapse-title flex flex-wrap items-center gap-x-4 gap-y-2 py-3 pe-12">
          <span class="size-10 shrink-0 rounded-xl bg-base-200 text-base-content/70 grid place-items-center" aria-hidden="true">
            <span class="material-icons text-[20px]">dns</span>
          </span>
          <span class="flex min-w-0 grow basis-48 flex-col">
            <span class="font-semibold">{{ row.deployment.serverName }}
              @if (row.nickName) {
                <span class="font-medium text-base-content/70">· {{ row.nickName }}</span>
              }
            </span>
            <span class="text-sm text-base-content/70">
              {{ row.deployment.deployedAt | dfnsParseIso | dfnsFormatDistanceToNowPure }} ago
              <span class="hidden sm:inline">· {{ row.deployment.deployedAt | dfnsParseIso | dfnsFormat: 'PPp' }}</span>
            </span>
          </span>
          @if (row.deployment.labels.length > 0) {
            <span class="flex flex-wrap gap-1.5" data-cy-id="labels-of-deployment">
              @for (label of row.deployment.labels; track label.id) {
                <span class="badge badge-soft badge-primary">{{ label.key }} = {{ label.value }}</span>
              }
            </span>
          }
          <span class="badge badge-ghost" data-cy-id="builds-of-deployment">
            {{ row.deployment.builds.length }} {{ row.deployment.builds.length === 1 ? 'build' : 'builds' }}
          </span>
        </div>
        <div class="collapse-content">
          <div class="overflow-hidden rounded-box border border-base-300">
            <bb-builds-accordion [builds]="row.deployment.builds"></bb-builds-accordion>
          </div>
        </div>
      </div>
    }
  `,
  imports: [DateFnsModule, BuildsAccordion],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeploymentList {
  readonly deployments = input.required<IDeployment[]>()
  readonly servers = input<IServer[]>([])

  readonly rows = computed((): DeploymentRow[] => this.deployments().map((deployment) => ({
    deployment,
    nickName: this.servers().find((s) => s.name === deployment.serverName)?.nickName ?? null
  })))
}
