import {ChangeDetectionStrategy, Component} from '@angular/core'
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {Store} from "@ngrx/store";
import {Buildz} from "../../core";
import {toggleSideNavState} from "../../core/state/nav/nav.actions";

@Component({
  selector: 'bb-toolbar',
  template: `
    <div class="navbar bg-base-100">
      <div class="flex-none">
        <button class="btn btn-square btn-ghost" (click)="toggleSideNavState()">
          <span class="material-icons">menu</span>
          <!--          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-5 h-5 stroke-current">-->
          <!--            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>-->
          <!--          </svg>-->
        </button>
      </div>
      <div class="flex-1">
        <a routerLink="/" class="btn btn-ghost normal-case text-xl">Build Bruh</a>
      </div>
      <div class="flex-none">
        <button class="btn btn-square btn-ghost">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-5 h-5 stroke-current">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path>
          </svg>
        </button>
      </div>
    </div>
    <!--    <mat-toolbar color="primary">-->
    <!--      <button mat-icon-button aria-label="Example icon-button with menu icon" (click)="toggleSideNavState()">-->
    <!--        <mat-icon>menu</mat-icon>-->
    <!--      </button>-->
    <!--      <a routerLink="/">Build Bruh</a>-->
    <!--    </mat-toolbar>-->
  `,
  standalone: true,
  imports: [CommonModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BuildBroToolbar {
  toggleSideNavState(): void {
    this.store.dispatch(toggleSideNavState())
  }

  constructor(private store: Store<Buildz>) {
  }
}
