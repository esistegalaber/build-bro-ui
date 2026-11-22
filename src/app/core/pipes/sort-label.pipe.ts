import {Pipe, PipeTransform} from '@angular/core'
import {IBuildLabel} from "../state/model";

@Pipe({
  name: 'sortedLabels'
})
export class SortedLabelsPipe implements PipeTransform {

  /** Sorts a copy, so the pipe also works on (frozen) store state. */
  transform(value: IBuildLabel[], ...args: any): IBuildLabel[] {
    return [...value].sort(
      (first, second) => first.key > second.key ? -1 : 1
    )
  }
}
