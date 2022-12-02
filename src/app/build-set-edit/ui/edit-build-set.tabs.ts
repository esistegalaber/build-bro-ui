import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from "@angular/core";
import {CommonModule} from "@angular/common";
import {InnerNavState} from "../state/edit-build-sets.reducer";

@Component({
  selector: 'bb-edit-build-set-tabs',
  template: `
    <div class="flex flex-row justify-center">
      <div class="tabs">
        <a class="tab tab-bordered"
           [ngClass]="{'tab-active': isActive('projects')}"
           (click)="toNavState.emit('projects')">
          Projects
        </a>
        <a class="tab tab-bordered tab-active"
           [ngClass]="{'tab-active': isActive('branches')}"
           (click)="toNavState.emit('branches')">
          Branches
        </a>
        <a class="tab tab-bordered">Labels</a>
        <a class="tab tab-bordered"
           [ngClass]="{'tab-active': isActive('verification')}"
           (click)="toNavState.emit('verification')">
          Verification
        </a>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule]
})
export class EditBuildSetTabs {

  @Input()
  nav!: InnerNavState
  @Output()
  toNavState = new EventEmitter<string>()

  isActive(state: string): boolean {
    return this.nav[state]
  }
}
