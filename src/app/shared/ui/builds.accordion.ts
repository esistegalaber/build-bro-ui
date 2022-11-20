import {ChangeDetectionStrategy, Component, Input} from '@angular/core'
import {IBuild} from '../../core/'
import {CommonModule} from "@angular/common";
import {BuildId} from "./build.id";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatListModule} from "@angular/material/list";

@Component({
  selector: 'bz-builds-accordion',
  template: `
    <mat-accordion>
      <mat-expansion-panel *ngFor="let build of builds">
        <mat-expansion-panel-header>
          <bb-build-id [build]="build"></bb-build-id>
        </mat-expansion-panel-header>
        <mat-list>
          <mat-list-item>
            <div class="row">
              <div class="col-3">
                Build Bro ID
              </div>
              <div class="col-9">
                {{build.id}}
              </div>
            </div>
          </mat-list-item>
          <mat-list-item *ngFor="let label of build.labels">
            <div class="row">
              <div class="col-3">
                {{label.key}}
              </div>
              <div class="col-9">
                {{label.value}}
              </div>
            </div>
          </mat-list-item>
        </mat-list>
      </mat-expansion-panel>
    </mat-accordion>

    <!--    <ngb-accordion [closeOthers]="true">-->
    <!--      <ngb-panel *ngFor="let build of builds" title="{{build.project}} :: {{build.branch}} :: {{build.buildNumber}}">-->
    <!--        <ng-template ngbPanelContent>-->
    <!--          <table class="table table-striped table-sm">-->
    <!--            <tr>-->
    <!--              <td>BB-Id:</td>-->
    <!--              <td>{{build.id}}</td>-->
    <!--            </tr>-->
    <!--            <tr *ngFor="let label of build.labels">-->
    <!--              <td>{{label.key}}</td>-->
    <!--              <td>{{label.value}}</td>-->
    <!--            </tr>-->
    <!--          </table>-->
    <!--        </ng-template>-->
    <!--      </ngb-panel>-->
    <!--    </ngb-accordion>-->
  `,
  standalone: true,
  imports: [CommonModule, BuildId, MatExpansionModule, MatListModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BuildsAccordion {
  @Input()
  builds: IBuild[] = []
}
