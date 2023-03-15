import {ChangeDetectionStrategy, Component, Input} from '@angular/core'
import {IDeployment} from '../../core'
import {CommonModule} from "@angular/common";

@Component({
  selector: 'bb-deployment-labels-table',
  template: `
      <table class="table table-compact w-full">
          <tbody>
          <tr *ngFor="let label of deployment.labels">
              <td><strong>{{label.key}}</strong></td>
              <td>{{label.value}}</td>
          </tr>
          </tbody>
      </table>
  `,
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeploymentLabelsTable {
  @Input()
  deployment!: IDeployment
}
