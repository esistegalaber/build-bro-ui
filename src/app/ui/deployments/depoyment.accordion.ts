import {ChangeDetectionStrategy, Component, Input} from '@angular/core'
import {IDeployment} from '../../core'
import {CommonModule} from "@angular/common";
import {BuildId} from "../builds/build.id";
import {RouterLink} from "@angular/router";
import {BuildsAccordion} from "../builds/builds.accordion";
import {DateFnsModule} from "ngx-date-fns";

@Component({
  selector: 'bb-deployment-accordion',
  template: `
      <div class="collapse collapse-arrow border rounded-box" *ngFor="let deployment of deployments">
          <input type="checkbox" class="peer"/>
          <div class="collapse-title">
              Deployed {{deployment.deployedAt | dfnsParseIso | dfnsFormatDistanceToNowPure}} ago
          </div>
          <div class="collapse-content">
              <bb-builds-accordion [builds]="deployment.builds"></bb-builds-accordion>
          </div>
      </div>
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    BuildId,
    RouterLink,
    BuildsAccordion,
    DateFnsModule
  ]
})
export class BuildSetAccordion {
  @Input()
  deployments!: IDeployment[]
}
