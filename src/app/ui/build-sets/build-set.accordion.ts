import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core'
import {IBuild, IBuildSet} from '../../core'
import {RouterLink} from "@angular/router";
import {BuildsAccordion} from "../builds/builds.accordion";

@Component({
  selector: 'bb-build-set-accordion',
  template: `
    @if (buildSet.name !== '') {
      <div class="card lg:card-side bg-base-100 shadow-xl" data-cy-id="build-set-card">
        <div class="card-body">
          <h2 class="card-title">Builds of {{buildSet.name}}</h2>
          <bb-builds-accordion
            [builds]="theBuilds()">
          </bb-builds-accordion>
          <div class="card-actions justify-end">
            <div class="btn-group">
              <button class="btn btn-warning" (click)="deleteBuildSet.emit(buildSet)" data-cy-id="build-set-delete">
                <span class="material-icons">backspace</span>
              </button>
              <button class="btn" [routerLink]="['/', 'edit-build-set','clone', buildSet.name]" data-cy-id="build-set-clone">
                <span class="material-icons">content_copy</span>
              </button>
              <button class="btn" [routerLink]="['/', 'edit-build-set', buildSet.name]" data-cy-id="build-set-edit">
                <span class="material-icons">edit</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
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
