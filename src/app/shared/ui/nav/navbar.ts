import {ChangeDetectionStrategy, Component} from '@angular/core'

@Component({
  selector: 'bz-navbar',
  template: `
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <bz-button>
        <fa-icon icon="bars"></fa-icon>
      </bz-button>
      <a class="navbar-brand" [routerLink]="['/']" data-test-id="build-bro-home">Build Bro</a>
    </nav>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Navbar {
}
