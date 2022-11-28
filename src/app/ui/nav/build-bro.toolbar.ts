import {ChangeDetectionStrategy, Component} from '@angular/core'
import {CommonModule} from "@angular/common";
import {MatToolbarModule} from "@angular/material/toolbar";
import {RouterModule} from "@angular/router";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {Store} from "@ngrx/store";
import {Buildz} from "../../core";
import {toggleSideNavState} from "../../core/state/nav/nav.actions";

@Component({
  selector: 'bb-toolbar',
  template: `
    <mat-toolbar color="primary">
      <button mat-icon-button aria-label="Example icon-button with menu icon" (click)="toggleSideNavState()">
        <mat-icon>menu</mat-icon>
      </button>
      <a routerLink="/">Build Bruh</a>
    </mat-toolbar>
  `,
  standalone: true,
  imports: [CommonModule, RouterModule, MatToolbarModule, MatButtonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BuildBroToolbar {
  toggleSideNavState(): void {
    this.store.dispatch(toggleSideNavState())
  }

  constructor(private store: Store<Buildz>) {
  }
}
