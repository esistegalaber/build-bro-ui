import {ChangeDetectionStrategy, Component, Input} from '@angular/core'
import {IDeployment} from '../../core'
import {BuildsAccordion} from "../builds/builds.accordion";
import {DateFnsModule} from "ngx-date-fns";
import {DeploymentLabelsTable} from "./deployment-labels.table";

@Component({
  selector: 'bb-deployment-accordion',
  template: `
      @for (deployment of deployments; track deployment.id) {
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
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    BuildsAccordion,
    DateFnsModule,
    DeploymentLabelsTable
  ]
})
export class BuildSetAccordion {
  @Input()
  deployments!: IDeployment[]
}
