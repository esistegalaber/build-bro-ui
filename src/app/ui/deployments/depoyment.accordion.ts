import {ChangeDetectionStrategy, Component, Input} from '@angular/core'
import {IDeployment} from '../../core'
import {BuildId} from "../builds/build.id";
import {RouterLink} from "@angular/router";
import {BuildsAccordion} from "../builds/builds.accordion";
import {DateFnsModule} from "ngx-date-fns";
import {DeploymentLabelsTable} from "./deployment-labels.table";

@Component({
  selector: 'bb-deployment-accordion',
  template: `
      @for (deployment of deployments; track deployment) {
        <div class="collapse collapse-arrow border rounded-box">
          <input type="checkbox" class="peer" attr.data-cy-id="deployment-{{deployment.id}}"/>
          <div class="collapse-title">
            <strong>{{deployment.serverName}}</strong> ({{deployment.deployedAt | dfnsParseIso | dfnsFormatDistanceToNowPure}} ago)
          </div>
          <div class="collapse-content">
            <bb-deployment-labels-table [deployment]="deployment"></bb-deployment-labels-table>
            <bb-builds-accordion [builds]="deployment.builds"></bb-builds-accordion>
          </div>
        </div>
      }
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    BuildId,
    RouterLink,
    BuildsAccordion,
    DateFnsModule,
    DeploymentLabelsTable
  ]
})
export class BuildSetAccordion {
  @Input()
  deployments!: IDeployment[]
}
