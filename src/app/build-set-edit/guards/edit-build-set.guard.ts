import {CanActivateFn} from "@angular/router";
import {inject} from "@angular/core";
import {Store} from "@ngrx/store";
import {Buildz} from "../../core";
import * as BuildSetActions from "../state/edit-build-sets.actions";

/** Loads the build set named in the route for editing. Only loads data, never blocks the navigation. */
export const editBuildSetGuard: CanActivateFn = (route) => {
  const buildSetName = route.params['build-set-name']
  if (!!buildSetName) {
    inject(Store<Buildz>).dispatch(BuildSetActions.loadBuildSetTemplate({name: buildSetName}))
  }
  return true
}
