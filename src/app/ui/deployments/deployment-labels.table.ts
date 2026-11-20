import {ChangeDetectionStrategy, Component, Input} from '@angular/core'
import {IDeployment} from '../../core'

@Component({
  selector: 'bb-deployment-labels-table',
  template: `
      <table class="table table-compact w-full">
        <tbody>
          @for (label of deployment.labels; track label) {
            <tr>
              <td><strong>{{label.key}}</strong></td>
              <td>{{label.value}}</td>
            </tr>
          }
        </tbody>
      </table>
  `,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeploymentLabelsTable {
  @Input()
  deployment!: IDeployment
}
