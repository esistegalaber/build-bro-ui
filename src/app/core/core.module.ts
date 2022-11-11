import {NgModule} from '@angular/core'
import {CloningPipe} from './pipes/cloning.pipe'
import {HttpClientModule} from '@angular/common/http'
import {CommonModule} from '@angular/common'

const reExport = [
  CommonModule,
  HttpClientModule,
]

@NgModule({
  imports: [
    ...reExport,
  ],
  declarations: [
    CloningPipe
  ],
  exports: [
    ...reExport,
    CloningPipe
  ]
})
export class CoreModule {
}
