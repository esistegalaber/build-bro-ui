import {ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output, viewChild} from "@angular/core";
import {RouterModule} from "@angular/router";
import {ISideNav} from "../../core";
import {Theme} from "../../core/theme.service";

interface NavItem {
  path: string
  label: string
  icon: string
  cyId: string
}

/** The app's sidebar: logo, main navigation and the theme switch. Collapses to icons only; on phones it is the slide-out menu. */
@Component({
  selector: 'bz-sidenav',
  template: `
    <aside class="w-full min-h-full box-border bg-base-100 border-r border-base-300 flex flex-col gap-6 px-4 py-5">
      <div class="flex items-center gap-2.5" [class.flex-col]="!sideNav.text">
        <a routerLink="/home" class="flex items-center gap-2.5 min-w-0 text-base-content no-underline" aria-label="Build Bruh home">
          <span class="size-9 shrink-0 rounded-[10px] bg-primary text-primary-content flex items-center justify-center">
            <span class="material-icons text-[20px]" aria-hidden="true">inventory_2</span>
          </span>
          @if (sideNav.text) {
            <span class="font-display font-extrabold text-lg tracking-tight">Build Bruh</span>
          }
        </a>
        <!-- wide screens: collapse to icons; phones: close the slide-out menu -->
        <button type="button" class="btn btn-ghost btn-square btn-sm hidden md:inline-flex" [class.ml-auto]="sideNav.text"
                (click)="toggleLabels.emit()" [attr.aria-label]="sideNav.text ? 'Collapse the menu' : 'Expand the menu'"
                [attr.aria-expanded]="sideNav.text" data-testid="side-nav-toggle">
          <span class="material-icons" aria-hidden="true">{{ sideNav.text ? 'menu_open' : 'menu' }}</span>
        </button>
        <button #closeButton type="button" class="btn btn-ghost btn-square btn-sm ml-auto md:hidden"
                (click)="closeMenu.emit()" aria-label="Close the menu" data-testid="drawer-close">
          <span class="material-icons" aria-hidden="true">close</span>
        </button>
      </div>

      <nav aria-label="Main" class="flex flex-col gap-1">
        @for (item of items; track item.path) {
          <a [routerLink]="item.path" routerLinkActive ariaCurrentWhenActive="page" [attr.data-testid]="item.cyId" (click)="navigated.emit()"
             [attr.title]="sideNav.text ? null : item.label"
             class="flex items-center gap-3 min-h-11 px-3 rounded-[10px] text-base-content/70 font-medium no-underline
                    hover:bg-base-200 hover:text-base-content
                    aria-[current=page]:bg-primary/10 aria-[current=page]:text-primary aria-[current=page]:font-semibold">
            <span class="material-icons text-[20px]" aria-hidden="true">{{ item.icon }}</span>
            @if (sideNav.text) {
              <span>{{ item.label }}</span>
            } @else {
              <span class="sr-only">{{ item.label }}</span>
            }
          </a>
        }
      </nav>

      <div class="mt-auto flex flex-col gap-2">
        @if (sideNav.text) {
          <div class="text-xs font-semibold text-base-content/70 px-2">Theme</div>
        }
        <div role="group" aria-label="Theme" class="flex gap-1 p-1 rounded-[10px] bg-base-200" [class.flex-col]="!sideNav.text">
          @for (option of themes; track option.name) {
            <button type="button" [attr.aria-pressed]="theme === option.name" (click)="themeSelected.emit(option.name)"
                    [attr.aria-label]="sideNav.text ? null : option.label" [attr.data-testid]="'theme-' + option.name"
                    class="flex-1 min-h-9 px-2 rounded-lg text-xs font-semibold text-base-content/70 cursor-pointer
                           flex items-center justify-center
                           aria-pressed:bg-base-100 aria-pressed:text-base-content aria-pressed:shadow-sm">
              @if (sideNav.text) {
                {{ option.label }}
              } @else {
                <span class="material-icons text-[18px]" aria-hidden="true">{{ option.icon }}</span>
              }
            </button>
          }
        </div>
      </div>
    </aside>
  `,
  imports: [RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SideNav {
  @Input()
  sideNav!: ISideNav
  @Input()
  theme!: Theme
  @Output()
  toggleLabels = new EventEmitter<void>()
  @Output()
  themeSelected = new EventEmitter<Theme>()
  /** a page was chosen (closes the slide-out menu on phones) */
  @Output()
  navigated = new EventEmitter<void>()
  /** the close button of the slide-out menu on phones */
  @Output()
  closeMenu = new EventEmitter<void>()

  private readonly closeButton = viewChild<ElementRef<HTMLButtonElement>>('closeButton')

  /** Moves the focus into the slide-out menu when it opens. */
  focusClose(): void {
    this.closeButton()?.nativeElement.focus()
  }

  readonly items: NavItem[] = [
    {path: '/home', label: 'Home', icon: 'home', cyId: 'nav-home'},
    {path: '/build-sets', label: 'Build Sets', icon: 'layers', cyId: 'nav-build-sets'},
    {path: '/builds', label: 'Builds', icon: 'inventory_2', cyId: 'nav-builds'},
    {path: '/deployments', label: 'Deployments', icon: 'rocket_launch', cyId: 'nav-deployments'},
    {path: '/servers', label: 'Servers', icon: 'dns', cyId: 'nav-servers'},
    {path: '/projects', label: 'Projects', icon: 'folder', cyId: 'nav-projects'},
    {path: '/labels', label: 'Labels', icon: 'sell', cyId: 'nav-labels'},
  ]

  readonly themes: { name: Theme, label: string, icon: string }[] = [
    {name: 'light', label: 'Light', icon: 'light_mode'},
    {name: 'dark', label: 'Dark', icon: 'dark_mode'},
    {name: 'lagoon', label: 'Lagoon', icon: 'water'},
  ]
}
