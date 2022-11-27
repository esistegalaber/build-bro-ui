import {ChangeDetectionStrategy, Component, Input} from '@angular/core'
import {IBuild, IBuildSet} from '../../../core'
import {CommonModule} from "@angular/common";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatListModule} from "@angular/material/list";
import {BuildId} from "../builds/build.id";
import {CardComponent} from "../generic/card.component";

@Component({
  selector: 'bb-build-set-accordion',
  template: `
    <bb-card title="Builds of {{buildSet.name}}">
      <mat-accordion>
        <mat-expansion-panel *ngFor="let build of theBuilds()">
          <mat-expansion-panel-header>
            <bb-build-id [build]="build"></bb-build-id>
          </mat-expansion-panel-header>
          <mat-list>
            <mat-list-item>
              <div class="grid grid-cols-2">
                <div>
                  <strong>Build Bro ID</strong>
                </div>
                <div>
                  {{build.id}}
                </div>
              </div>
            </mat-list-item>
            <mat-list-item *ngFor="let label of build.labels">
              <div class="grid grid-cols-2">
                <div>
                  <strong>{{label.key}}</strong>
                </div>
                <div>
                  {{label.value}}
                </div>
              </div>
            </mat-list-item>
          </mat-list>
        </mat-expansion-panel>
      </mat-accordion>
    </bb-card>

  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    BuildId,
    MatExpansionModule,
    MatListModule,
    CardComponent
  ]
})
export class BuildSetAccordion {
  @Input()
  buildSet!: IBuildSet

  theBuilds(): IBuild[] {
    return Object.values(this.buildSet.builds)
  }
}
