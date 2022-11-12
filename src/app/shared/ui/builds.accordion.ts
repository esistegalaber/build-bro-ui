import {ChangeDetectionStrategy, Component, Input} from '@angular/core'
import {IBuild} from '../../core/'

@Component({
  selector: 'bz-builds-accordion',
  template: `
    <ngb-accordion [closeOthers]="true">
      <ngb-panel *ngFor="let build of builds" title="{{build.project}} :: {{build.branch}} :: {{build.buildNumber}}">
        <ng-template ngbPanelContent>
          <table class="table table-striped table-sm">
            <tr *ngFor="let label of build.labels">
              <td>{{label.id}}</td>
              <td>{{label.key}}</td>
              <td>{{label.value}}</td>
            </tr>
          </table>
        </ng-template>
      </ngb-panel>
    </ngb-accordion>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BuildsAccordion {
  @Input()
  builds: IBuild[] = []
}
