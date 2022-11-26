// Initial Alert state
import {INavState} from "../model";
import {createReducer, on} from "@ngrx/store";
import {toggleSideNavState} from "./nav.actions";

export const INITIAL_NAV_STATE: INavState = {
  sidenav: {
    visible: true,
    text: false
  }
}
// The Reducer
export const navReducer = createReducer(
  INITIAL_NAV_STATE,
  on(toggleSideNavState, (state: INavState) => {
      const newState = {...state}
      if (!state.sidenav.visible) {
        return INITIAL_NAV_STATE
      }
      if (!state.sidenav.text) {
        return {
          sidenav: {
            visible: true,
            text: true
          }
        }
      }
      return {
        sidenav: {
          visible: false,
          text: true
        }
      }
    }
  )
)
