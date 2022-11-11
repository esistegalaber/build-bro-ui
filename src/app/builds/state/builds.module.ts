import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {StoreModule} from "@ngrx/store";
import {buildsFeature} from "./builds.feature";
import {EffectsModule} from "@ngrx/effects";
import {BuildsEffects} from "./builds.effects";

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(buildsFeature),
    EffectsModule.forFeature([BuildsEffects])
  ]
})
export class BuildsModule {

}
