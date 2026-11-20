import {ChangeDetectionStrategy, Component, inject} from "@angular/core";
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
      <input id="inactiveToggle" type="checkbox" [checked]="inactiveDataIncluded$|async" class="toggle toggle-success" data-cy-id="inactive-toggle"
        (click)="toggleInactive()"
        />
    </div>
    <table class="table table-compact">
      @for (project of (projects$|async)!; track project.id) {
        <tr attr.data-cy-id="project-{{project.name}}">
          <td colspan="2">{{project.name}}</td>
          <td>
          </td>
        </tr>
        @for (branch of project.branches; track branch.id) {
          <tr attr.data-cy-id="branch-{{branch.id}}">
            <td></td>
            <td>{{branch.name}}</td>
            <td>
              @if (branch.active) {
                <button class="btn" (click)="deactivateBranch(branch.id)" data-cy-id="branch-deactivate">
                  <span class="material-icons">check_box</span>
                </button>
              }
              @if (!branch.active) {
                <button class="btn" (click)="activateBranch(branch.id)" data-cy-id="branch-activate">
                  <span class="material-icons">check_box_outline_blank</span>
                </button>
              }
            </td>
          </tr>
        }
      }
    </table>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule
  ]
})
export class ProjectsPage {
  private store = inject<Store<Buildz>>(Store);

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
}
