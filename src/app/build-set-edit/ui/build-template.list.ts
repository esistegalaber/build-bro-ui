import {ChangeDetectionStrategy, Component, computed, input, output, signal} from "@angular/core";
import {EditableBuildTemplate, ILabelDefinition, IProject} from "../../core";
import {BuildTemplateForm} from "./build-template.form";

type Show = 'all' | 'included' | 'excluded'

/** All projects of the build set as one compact list, with a search and an All / Included / Not included filter. */
@Component({
  selector: 'bb-build-template-list',
  template: `
    <section class="card bg-base-100 border border-base-300 shadow-sm overflow-hidden" aria-label="Projects">
      <div class="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
        <div class="flex items-baseline gap-2">
          <h2 class="text-lg font-bold">Projects</h2>
          <span class="text-sm text-base-content/70" data-cy-id="projects-count">{{ includedCount() }} of {{ templates().length }} included</span>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <label class="input input-sm w-52">
            <span class="material-icons text-[18px] opacity-60" aria-hidden="true">search</span>
            <input type="search" placeholder="Search projects" aria-label="Search projects" data-cy-id="project-search"
                   [value]="query()" (input)="query.set($any($event.target).value)">
          </label>
          <div role="group" aria-label="Show" class="join">
            @for (option of showOptions; track option.value) {
              <button type="button" class="join-item btn btn-sm" [class.btn-active]="show() === option.value"
                      [attr.aria-pressed]="show() === option.value" (click)="show.set(option.value)"
                      [attr.data-cy-id]="'show-' + option.value">{{ option.label }}</button>
            }
          </div>
        </div>
      </div>
      <div class="hidden items-center gap-3 bg-base-200 px-5 py-2 text-xs font-semibold text-base-content/70 md:flex" aria-hidden="true">
        <span class="w-9"></span>
        <span class="grow basis-28">Project</span>
        <span class="w-36">Branch</span>
        <span class="w-24">Build number</span>
        <span class="w-36">Label filter</span>
      </div>
      @for (template of visibleTemplates(); track template.project.id) {
        <bb-build-template-form [template]="template" [labelDefinitions]="labelDefinitions()"
                                (projectAdded)="projectAdded.emit($event)"
                                (projectRemoved)="projectRemoved.emit($event)"
                                (templateUpdated)="templateUpdated.emit($event)"></bb-build-template-form>
      } @empty {
        <p class="border-t border-base-300 px-5 py-8 text-center text-base-content/70" data-cy-id="projects-none">No project matches.</p>
      }
    </section>
  `,
  imports: [BuildTemplateForm],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BuildTemplateList {
  readonly templates = input.required<EditableBuildTemplate[]>()
  /** Label definitions, handed on to the rows */
  readonly labelDefinitions = input<ILabelDefinition[]>([])
  readonly projectAdded = output<IProject>()
  readonly projectRemoved = output<IProject>()
  readonly templateUpdated = output<EditableBuildTemplate>()

  readonly showOptions: { value: Show, label: string }[] = [
    {value: 'all', label: 'All'},
    {value: 'included', label: 'Included'},
    {value: 'excluded', label: 'Not included'}
  ]
  readonly query = signal('')
  readonly show = signal<Show>('all')

  readonly includedCount = computed(() => this.templates().filter((t) => t.projectSelected).length)
  readonly visibleTemplates = computed(() => {
    const query = this.query().trim().toLowerCase()
    const show = this.show()
    return this.templates().filter((t) =>
      t.project.name.toLowerCase().includes(query)
      && (show === 'all' || (show === 'included') === t.projectSelected))
  })
}
