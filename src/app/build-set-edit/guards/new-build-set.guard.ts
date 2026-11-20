import {CanActivateFn} from "@angular/router";
import {inject} from "@angular/core";
import {Store} from "@ngrx/store";
import {Buildz} from "../../core";
import * as BuildSetActions from "../state/edit-build-sets.actions";

/** Starts an empty build set. Only loads data, never blocks the navigation. */
export const newBuildSetGuard: CanActivateFn = () => {
  inject(Store<Buildz>).dispatch(BuildSetActions.newBuildSet())
  return true
}
