import {ChangeDetectionStrategy, Component} from '@angular/core'

@Component({
  selector: 'bz-navbar',
  template: `
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <a class="navbar-brand" [routerLink]="['/']" data-test-id="build-bro-home">Build Bro</a>
    </nav>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Navbar {
}
