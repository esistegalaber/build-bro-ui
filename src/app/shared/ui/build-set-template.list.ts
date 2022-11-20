import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core'

@Component({
  selector: 'bz-build-set-template-list',
  template: `
    <div class="card">
      <div class="card-body">
        <h6 class="card-title">Defined Templates</h6>
      </div>
      <div class="list-group list-group-flush">
        <!--      <span class="list-group-item list-group-item-primary">Defined Templates</span>-->
        <button class="list-group-item list-group-item-action" *ngFor="let templateName of templateNames"
                (click)="templateSelected.emit(templateName)"
        >
          {{templateName}}
        </button>
      </div>
      <div class="card-body">
        <button class="btn btn-primary" (click)="newBuildSetTemplate.emit()">
<!--          <fa-icon icon="plus"></fa-icon>-->
          New Template
        </button>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BuildSetTemplateList {
  @Input()
  templateNames: string[] = []
  @Output()
  templateSelected = new EventEmitter<string>()
  @Output()
  newBuildSetTemplate = new EventEmitter<void>()
}
