import {ChangeDetectionStrategy, Component, Input} from '@angular/core'
import {IBuild} from '../../core'
import {CommonModule} from "@angular/common";
import {BuildId} from "./build.id";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatListModule} from "@angular/material/list";

@Component({
  selector: 'bb-builds-accordion',
  template: `
    <mat-accordion>
      <mat-expansion-panel *ngFor="let build of builds">
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
  `,
  standalone: true,
  imports: [CommonModule, BuildId, MatExpansionModule, MatListModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BuildsAccordion {
  @Input()
  builds: IBuild[] = []
}
