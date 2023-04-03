import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core'
import {IBuild, IBuildSet} from '../../core'
import {CommonModule} from "@angular/common";
import {BuildId} from "../builds/build.id";
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
              <button class="btn btn-warning" (click)="deleteBuildSet.emit(buildSet)">
                <span class="material-icons">backspace</span>
              </button>
              <button class="btn" [routerLink]="['/', 'edit-build-set','clone', buildSet.name]">
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
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    BuildId,
    RouterLink,
    BuildsAccordion
  ]
})
export class BuildSetAccordion {
  @Input()
  buildSet!: IBuildSet
  @Output()
  deleteBuildSet = new EventEmitter<IBuildSet>()

  theBuilds(): IBuild[] {
    return Object.values(this.buildSet.builds)
  }
}
