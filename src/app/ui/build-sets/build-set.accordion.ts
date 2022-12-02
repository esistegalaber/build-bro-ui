import {ChangeDetectionStrategy, Component, Input} from '@angular/core'
import {IBuild, IBuildSet} from '../../core'
import {CommonModule} from "@angular/common";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatListModule} from "@angular/material/list";
import {BuildId} from "../builds/build.id";
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {RouterLink} from "@angular/router";
import {BuildsAccordion} from "../builds/builds.accordion";

@Component({
  selector: 'bb-build-set-accordion',
  template: `
    <ng-container *ngIf="buildSet.name !== ''">
      <div class="card lg:card-side bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">Builds of {{buildSet.name}}</h2>
          <bb-builds-accordion
            [builds]="theBuilds()">
          </bb-builds-accordion>
          <div class="card-actions justify-end">
            <div class="btn-group">

              <button class="btn btn-warning">
                <span class="material-icons">backspace</span>
              </button>
              <button class="btn">
                <span class="material-icons">content_copy</span>
              </button>
              <button class="btn" [routerLink]="['/', 'edit-build-set', buildSet.name]">
                <span class="material-icons">edit</span>
              </button>
            </div>

          </div>
        </div>
      </div>
    </ng-container>
<!--    <mat-card class="m-1">-->
<!--      <mat-card-header>-->
<!--        <mat-card-title>Builds of {{buildSet.name}}</mat-card-title>-->
<!--      </mat-card-header>-->
<!--      <mat-card-content>-->
<!--        <mat-accordion>-->
<!--          <mat-expansion-panel *ngFor="let build of theBuilds()">-->
<!--            <mat-expansion-panel-header>-->
<!--              <bb-build-id [build]="build"></bb-build-id>-->
<!--            </mat-expansion-panel-header>-->
<!--            <mat-list>-->
<!--              <mat-list-item>-->
<!--                <div class="grid grid-cols-2">-->
<!--                  <div>-->
<!--                    <strong>Build Bro ID</strong>-->
<!--                  </div>-->
<!--                  <div>-->
<!--                    {{build.id}}-->
<!--                  </div>-->
<!--                </div>-->
<!--              </mat-list-item>-->
<!--              <mat-list-item *ngFor="let label of build.labels">-->
<!--                <div class="grid grid-cols-2">-->
<!--                  <div>-->
<!--                    <strong>{{label.key}}</strong>-->
<!--                  </div>-->
<!--                  <div>-->
<!--                    {{label.value}}-->
<!--                  </div>-->
<!--                </div>-->
<!--              </mat-list-item>-->
<!--            </mat-list>-->
<!--          </mat-expansion-panel>-->
<!--        </mat-accordion>-->
<!--      </mat-card-content>-->
<!--      <mat-card-actions>-->
<!--        <button [routerLink]="['/edit-build-set', buildSet.name]">-->
<!--          <mat-icon>edit</mat-icon>-->
<!--        </button>-->
<!--      </mat-card-actions>-->
<!--    </mat-card>-->



  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    BuildId,
    MatExpansionModule,
    MatListModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    BuildsAccordion
  ]
})
export class BuildSetAccordion {
  @Input()
  buildSet!: IBuildSet

  theBuilds(): IBuild[] {
    return Object.values(this.buildSet.builds)
  }
}
