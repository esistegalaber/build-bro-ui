import {Pipe, PipeTransform} from '@angular/core'

@Pipe({
  name: 'deepClone',
  standalone: true
})
export class CloningPipe implements PipeTransform {

  transform(value: any, ...args: any): any {
    return JSON.parse(JSON.stringify(value))
  }
}
