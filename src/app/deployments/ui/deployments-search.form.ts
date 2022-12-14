import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from "@angular/core";
import {CommonModule} from "@angular/common";
import {IDeploymentSearch, IServer} from "../../core";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'bb-deployments-search-form',
  template: `
    <div class="container p-1">
      <form novalidate (submit)="updateSearch.emit(theSearch)" #searchForm="ngForm">
        <div class="grid grid-cols-12 gap-2">
          <select class="select select-bordered select-sm w-full max-w-xs col-span-4"
                  name="project"
                  [(ngModel)]="theSearch.serverName"
                  (ngModelChange)="updateSearch.emit(theSearch)"
          >
            <option value="" i18n="@@project_select_nonw">All</option>
            <option *ngFor="let server of servers" [value]="server.name">{{server.name}}</option>
          </select>


          <div class="col-span-6">
            <div class="flex justify-around">
              <button class="btn btn-sm btn-accent" (click)="resetSearch.emit()">
                <span class="material-icons">restart_alt</span>
                Reset
              </button>

              <select class="select select-bordered select-sm"
                      name="pageSize"
                      [(ngModel)]="theSearch.pageSize"
                      (ngModelChange)="updateSearch.emit(theSearch)"
              >
                <option [value]="10">10 / Page</option>
                <option [value]="25">25 / Page</option>
                <option [value]="50">50 / Page</option>
              </select>
              <button class="btn btn-sm btn-primary" (click)="updateSearch.emit(theSearch)" css="btn-sm btn-secondary">
                <span class="material-icons">search</span>
                (Re-)Load
              </button>

            </div>
          </div>

          <div class="col-span-6">
            <div class="grid grid-cols-12">
              <div class="col-span-4">
                <input class="input input-bordered input-sm" type="text" placeholder="Key" name="newLabelKey"
                       [(ngModel)]="newLabelKey"
                >
              </div>
              <div class="col-span-4">
                <input class="input input-bordered input-sm" type="text" placeholder="Value" name="newLabelVal"
                       [(ngModel)]="newLabelVal">
              </div>
              <div class="col-span-4">
                <button [disabled]="newLabelVal.length==0 || newLabelVal.length==0 " class="btn btn-sm" (click)="addSearchLabel()">
                  <span class="material-icons">add</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
      <!--      <div class="grid grid-cols-12 gap-2" *ngFor="let label of theSearch.labels | keyvalue">-->
      <!--        <input type="text" value="{{label.key}}" class="input-bordered input input-sm col-span-5" readonly>-->
      <!--        <input type="text" value="{{label.value}}" class="input-bordered input input-sm col-span-5" readonly>-->
      <!--        <button class="btn btn-sm btn-secondary" (click)="removeSearchLabel(label.key)">-->
      <!--          <span class="material-icons">remove</span>-->
      <!--        </button>-->
      <!--      </div>-->
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class DeploymentsSearchForm {
  @Input()
  servers!: IServer[]
  @Input()
  theSearch!: IDeploymentSearch
  @Output()
  resetSearch = new EventEmitter<void>()
  @Output()
  updateSearch = new EventEmitter<IDeploymentSearch>()
  newLabelKey = '';
  newLabelVal = '';

  addSearchLabel() {
    // this.theSearch.labels[this.newLabelKey] = this.newLabelVal;
    // this.newLabelKey = ''
    // this.newLabelVal = ''
    // this.updateSearch.emit(this.theSearch)
  }

}
