import {afterNextRender, ChangeDetectionStrategy, Component, computed, DestroyRef, inject, Injector, OnInit, signal, viewChild} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {AsyncPipe} from '@angular/common';
import {RouterModule} from '@angular/router';
import {Store} from '@ngrx/store';
import {alertState, theSideNavState} from './core/state/selectors';
import {Buildz} from './core';
import {clearAlert} from './core/state/alerts/alert.actions';
import {loadBuildStats} from './core/state/stats/stats.state';
import {toggleSideNavState} from './core/state/nav/nav.actions';
import {SideNav} from './ui/nav/side.nav';
import {AlertPanel} from './ui/alert.panel';
import * as CoreActions from './core/actions';
import {Theme, ThemeService} from './core/theme.service';

/** Below this width the side nav becomes a slide-out menu behind a top bar (Tailwind's md breakpoint). */
export const PHONE_QUERY = '(width < 48rem)'

@Component({
  selector: 'bz-root',
  template: `
    <div class="drawer md:drawer-open min-h-screen bg-base-200 text-base-content">
      <input id="nav-drawer" type="checkbox" class="drawer-toggle" tabindex="-1" aria-hidden="true"
             [checked]="menuOpen()" (change)="menuOpen.set($any($event.target).checked)"/>

      <div class="drawer-content flex flex-col">
        <header class="md:hidden sticky top-0 z-10 flex items-center gap-2 bg-base-100 border-b border-base-300 px-4 py-2">
          <button #menuButton type="button" class="btn btn-ghost btn-square" (click)="openMenu()"
                  aria-label="Open the menu" aria-controls="main-menu" [attr.aria-expanded]="menuOpen()" data-testid="drawer-open">
            <span class="material-icons" aria-hidden="true">menu</span>
          </button>
          <a routerLink="/home" class="flex items-center gap-2.5 text-base-content no-underline" aria-label="Build Bruh home">
            <span class="size-8 shrink-0 rounded-[10px] bg-primary text-primary-content flex items-center justify-center">
              <span class="material-icons text-[18px]" aria-hidden="true">inventory_2</span>
            </span>
            <span class="font-display font-extrabold text-lg tracking-tight">Build Bruh</span>
          </a>
        </header>
        <main class="min-w-0 box-border px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
          <div class="max-w-[1120px] mx-auto flex flex-col gap-6">
            <bz-alert-panel (clearAlert)="clearAlert()" [alert]="(alert | async)!"></bz-alert-panel>
            <!-- hidden: the empty outlet would add a gap of its own above the page -->
            <router-outlet class="hidden"></router-outlet>
          </div>
        </main>
      </div>

      <div #menu class="drawer-side z-20" id="main-menu" (keydown.escape)="closeMenu()" (transitionend)="focusIntoMenu()">
        <label for="nav-drawer" class="drawer-overlay" aria-label="Close the menu"></label>
        <bz-sidenav class="flex min-h-full" [class.w-60]="nav().text"
                    [sideNav]="nav()" [theme]="themeService.theme()"
                    (toggleLabels)="toggleSideNav()" (themeSelected)="selectTheme($event)"
                    (navigated)="menuOpen.set(false)" (closeMenu)="closeMenu()"></bz-sidenav>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AsyncPipe, SideNav, AlertPanel, RouterModule]
})
export class AppComponent implements OnInit {
  private store = inject<Store<Buildz>>(Store);
  private injector = inject(Injector);
  protected themeService = inject(ThemeService);

  alert = this.store.select(alertState)
  private readonly sideNavState = toSignal(this.store.select(theSideNavState), {initialValue: {text: true}})

  /** whether the screen is narrow enough for the top bar and the slide-out menu */
  readonly isPhone = signal(false)
  /** whether the slide-out menu is open (phones only) */
  readonly menuOpen = signal(false)
  /** The slide-out menu always shows the labels; collapsing to icons is for wide screens. */
  readonly nav = computed(() => this.isPhone() ? {...this.sideNavState(), text: true} : this.sideNavState())

  private readonly sideNav = viewChild.required(SideNav)
  private readonly menuButton = viewChild<{ nativeElement: HTMLButtonElement }>('menuButton')
  private readonly menu = viewChild.required<{ nativeElement: HTMLElement }>('menu')

  constructor() {
    this.store.dispatch(loadBuildStats())
    const query = typeof window !== 'undefined' && window.matchMedia ? window.matchMedia(PHONE_QUERY) : null
    if (query) {
      this.isPhone.set(query.matches)
      const onChange = (event: MediaQueryListEvent) => {
        this.isPhone.set(event.matches)
        if (!event.matches) this.menuOpen.set(false)
      }
      query.addEventListener('change', onChange)
      inject(DestroyRef).onDestroy(() => query.removeEventListener('change', onChange))
    }
  }

  ngOnInit(): void {
    this.store.dispatch(CoreActions.loadProjects())
    this.store.dispatch(CoreActions.loadServers())
    this.store.dispatch(CoreActions.loadLabelDefinitions())
  }

  openMenu(): void {
    this.menuOpen.set(true)
    afterNextRender(() => this.focusIntoMenu(), {injector: this.injector})
  }

  /** The menu can't take the focus while it is still hidden, so this runs again when it has slid in. */
  focusIntoMenu(): void {
    if (this.menuOpen() && !this.menu().nativeElement.contains(document.activeElement)) this.sideNav().focusClose()
  }

  closeMenu(): void {
    if (!this.menuOpen()) return
    this.menuOpen.set(false)
    this.menuButton()?.nativeElement.focus()
  }

  clearAlert(): void {
    this.store.dispatch(clearAlert())
  }

  toggleSideNav(): void {
    this.store.dispatch(toggleSideNavState())
  }

  selectTheme(theme: Theme): void {
    this.themeService.setTheme(theme)
  }
}
