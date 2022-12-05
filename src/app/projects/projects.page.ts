import {ChangeDetectionStrategy, Component} from "@angular/core";
import {select, Store} from "@ngrx/store";
import {Buildz} from "../core";
import {CommonModule} from "@angular/common";
import * as CoreActions from "../core/actions";
import {includeInactiveData, projectsData} from "../core/state/projects/project.selectors";
import {toggleInactiveData} from "../core/actions";

@Component({
  template: `
    <h1>Projects</h1>
    <div class="form-control">
      <label for="inactiveToggle">Inactive</label>
      <input id="inactiveToggle" type="checkbox" [checked]="inactiveDataIncluded$|async" class="toggle toggle-success"
             (click)="toggleInactive()"
      />
    </div>
    <table class="table table-compact">
      <ng-container *ngFor="let project of (projects$|async)!">
        <tr>
          <td colspan="2">{{project.name}}</td>
          <td>
          </td>
        </tr>
        <tr *ngFor="let branch of project.branches">
          <td></td>
          <td>{{branch.name}}</td>
          <td>
            <button class="btn" *ngIf="branch.active" (click)="deactivateBranch(branch.id)">
              <span class="material-icons">check_box</span>
            </button>
            <button class="btn" *ngIf="!branch.active" (click)="activateBranch(branch.id)">
              <span class="material-icons">check_box_outline_blank</span>
            </button>
          </td>
        </tr>
      </ng-container>
    </table>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule
  ]
})
export class ProjectsPage {
  inactiveDataIncluded$ = this.store.pipe(select(includeInactiveData))
  projects$ = this.store.pipe(select(projectsData))

  deactivateBranch(branchId: number) {
    this.store.dispatch(CoreActions.deactivateBranch({branchId}))
  }

  activateBranch(branchId: number) {
    this.store.dispatch(CoreActions.activateBranch({branchId}))
  }

  toggleInactive(): void {
    this.store.dispatch(toggleInactiveData())
  }

  constructor(private store: Store<Buildz>) {
  }
}
