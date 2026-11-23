import {afterNextRender, ChangeDetectionStrategy, Component, ElementRef, inject, Injector, signal, viewChild} from "@angular/core";
import {select, Store} from "@ngrx/store";
import {AsyncPipe} from "@angular/common";
import {RouterLink} from "@angular/router";
import {Buildz, IBuildSet, theLabelDefinitions} from "../core";
import {theBuildSet, theBuildSetSummaries, theSelectedBuildSetName, theSelectedSummary} from "./state/build-sets.selectors";
import {deleteBuildSetTemplate, loadBuildSetOf} from "./state/build-sets.actions";
import {BuildSetList} from "../ui/build-sets/build-set.list";
import {BuildSetCard} from "../ui/build-sets/build-set.card";

import {PageHeader} from '../ui/page-header'
import {EmptyState} from '../ui/empty-state'
@Component({
  template: `
    @let selected = (selectedName$ | async);
    <div class="flex flex-col gap-6">
      <bb-page-header heading="Build sets" description="Named combinations of builds, for example everything that goes onto one server.">
        <a class="btn btn-primary" routerLink="/edit-build-set" data-cy-id="build-set-add">
          <span class="material-icons text-[18px]" aria-hidden="true">add</span>New build set
        </a>
      </bb-page-header>

      <div class="flex flex-wrap items-start gap-6">
        <bb-build-set-list class="block min-w-0 grow basis-60"
                           [summaries]="(summaries$ | async)!" [selectedName]="selected"
                           (buildSetSelected)="select($event)"></bb-build-set-list>
        <div class="min-w-0 grow-[999] basis-[480px]">
          @if (selected) {
            <bb-build-set-card [buildSet]="(theBuildSet$ | async)!" [summary]="(selectedSummary$ | async)"
                               [labelDefinitions]="(labelDefinitions$ | async) ?? []"
                               (deleteBuildSet)="askToDelete($event)"></bb-build-set-card>
          } @else {
            <bb-empty-state icon="touch_app" framed data-cy-id="build-set-none">
              <p>Choose a build set to see the builds it resolves to.</p>
            </bb-empty-state>
          }
        </div>
      </div>
    </div>

    <div class="modal" [class.modal-open]="toDelete() !== null" role="dialog" aria-modal="true"
         aria-labelledby="delete-dialog-title" (keydown.escape)="cancelDelete()" data-cy-id="delete-confirmation-dialog">
      @if (toDelete(); as buildSet) {
        <div class="modal-box">
          <h3 id="delete-dialog-title" class="text-lg font-bold">Delete {{ buildSet.name }}?</h3>
          <p class="py-4">The build set <strong>{{ buildSet.name }}</strong> is deleted for good. Its builds and deployments stay.</p>
          <div class="modal-action">
            <button #cancelButton type="button" class="btn btn-ghost" (click)="cancelDelete()" data-cy-id="delete-cancel">Cancel</button>
            <button type="button" class="btn btn-error" (click)="confirmDelete()" data-cy-id="delete-confirm">Delete</button>
          </div>
        </div>
        <div class="modal-backdrop" (click)="cancelDelete()"></div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AsyncPipe, RouterLink, BuildSetList, BuildSetCard, PageHeader, EmptyState]
})
export class BuildSetsPage {
  private store = inject<Store<Buildz>>(Store);
  private injector = inject(Injector);

  summaries$ = this.store.pipe(select(theBuildSetSummaries))
  theBuildSet$ = this.store.pipe(select(theBuildSet))
  selectedName$ = this.store.pipe(select(theSelectedBuildSetName))
  selectedSummary$ = this.store.pipe(select(theSelectedSummary))
  labelDefinitions$ = this.store.pipe(select(theLabelDefinitions))

  /** The build set waiting for the delete confirmation, or null when the dialog is closed. */
  readonly toDelete = signal<IBuildSet | null>(null)
  private readonly cancelButton = viewChild<ElementRef<HTMLButtonElement>>('cancelButton')

  select(templateName: string): void {
    this.store.dispatch(loadBuildSetOf({templateName}))
  }

  askToDelete(buildSet: IBuildSet): void {
    this.toDelete.set(buildSet)
    // move the focus into the dialog, onto the safe choice
    afterNextRender(() => this.cancelButton()?.nativeElement.focus(), {injector: this.injector})
  }

  cancelDelete(): void {
    this.toDelete.set(null)
  }

  confirmDelete(): void {
    const buildSet = this.toDelete()
    if (buildSet) {
      this.store.dispatch(deleteBuildSetTemplate({name: buildSet.name}))
    }
    this.toDelete.set(null)
  }
}
