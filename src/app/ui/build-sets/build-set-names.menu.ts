import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from "@angular/core";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'bb-build-set-names-menu',
  template: `
    <ul class="menu bg-base-100 w-56 rounded-box">
      @for (name of names; track name) {
        <li class="hover-bordered">
          <a [ngClass]="{'active':name === selectedName}" attr.data-cy-id="build-set-name-{{name}}"
            (click)="buildSetSelected.emit(name)">
            {{name}}
          </a>
        </li>
      }
    </ul>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule]
})
export class BuildSetNamesMenu {
  @Input()
  names!: string[]
  @Input()
  selectedName: string | null = null
  @Output()
  buildSetSelected = new EventEmitter<string>()

}
