import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'bb-build-set-names-menu',
  template: `
    <ul class="menu bg-base-100 w-56 rounded-box">
      <li class="hover-bordered">
        <a routerLink="/edit-build-set/new">Create New</a>
      </li>
      <li *ngFor="let name of names" class="hover-bordered">
        <a [ngClass]="{'active':name === selectedName}"
           (click)="buildSetSelected.emit(name)">
          {{name}}
        </a>
      </li>
    </ul>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, RouterLink]
})
export class BuildSetNamesMenu {
  @Input()
  names!: string[]
  @Input()
  selectedName: string | null = null
  @Output()
  buildSetSelected = new EventEmitter<string>()

}
