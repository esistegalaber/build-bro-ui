import {ChangeDetectionStrategy, Component, DOCUMENT, inject} from '@angular/core'
import {RouterModule} from "@angular/router";
import {Store} from "@ngrx/store";
import {Buildz} from "../../core";
import {toggleSideNavState} from "../../core/state/nav/nav.actions";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'bb-toolbar',
  template: `
    <div class="navbar bg-base-100">
      <div class="flex-none">
        <button class="btn btn-square btn-ghost" (click)="toggleSideNavState()" data-cy-id="side-nav-toggle">
          <span class="material-icons">menu</span>
        </button>
      </div>
      <div class="flex-1">
        <a routerLink="/" class="btn btn-ghost normal-case text-xl">Build Bruh</a>
      </div>
      <div class="flex-none tooltip tooltip-bottom" data-tip="Choose a Theme at your own risk.">
        <select class="select select-sm select-ghost" name="bb-theme" [(ngModel)]="theme" (change)="switchTheme()" data-cy-id="theme-select">
          <option value="null">Select Theme</option>
          <option value="dark">dark</option>
          <option value="light">light</option>
          <option value="retro">retro</option>
          <option value="cupcake">cupcake</option>
          <option value="halloween">halloween</option>
          <option value="luxury">luxury</option>
        </select>
      </div>
    </div>
  `,
  imports: [RouterModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BuildBroToolbar {
  private store = inject<Store<Buildz>>(Store);
  private document = inject<Document>(DOCUMENT);

  theme: string | null = 'light'

  toggleSideNavState(): void {
    this.store.dispatch(toggleSideNavState())
  }

  switchTheme(): void {
    if (!!this.theme) {
      this.document.getElementById('bb-html')?.setAttribute('data-theme', this.theme)
    } else {
      this.document.getElementById('bb-html')?.removeAttribute('data-theme')
    }
  }
}
