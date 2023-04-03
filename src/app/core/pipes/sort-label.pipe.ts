import {Pipe, PipeTransform} from '@angular/core'
import {IBuildLabel} from "../state/model";

@Pipe({
  name: 'sortedLabels',
  standalone: true
})
export class SortedLabelsPipe implements PipeTransform {

  transform(value: IBuildLabel[], ...args: any): any {
    return value.sort(
      (first, second) => first.key > second.key ? -1 : 1
    )
  }
}
