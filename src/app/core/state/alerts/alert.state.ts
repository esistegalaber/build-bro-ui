import {createReducer, on} from '@ngrx/store'
import {IAlert} from '../model'
import * as AlertActions from "./alert.actions";

// Initial Alert state
export const INITIAL_ALERT: IAlert = {
  message: '',
  heading: '',
  type: ''
}
// The Reducer
export const alertReducer = createReducer(
  INITIAL_ALERT,
  on(AlertActions.backendErrorOccurred, (state: IAlert, {errorResponse}) => {
    if (!!errorResponse?.error?.message) {
      return {
        type: 'alert-error',
        heading: errorResponse.error.description,
        message: errorResponse.error.message
      }
    } else {
      return {
        type: 'alert-error',
        heading: `Unexpected Error: ${errorResponse?.status}`,
        message: `An unexpected error occurred. ${errorResponse?.status}`
      }
    }
  }),
  on(AlertActions.frontendInfo, (state: IAlert, {alertMessage}) => {
    return {
      type: 'alert-info',
      heading: alertMessage.heading,
      message: alertMessage.message
    }
  }),
  on(AlertActions.frontendError, (state: IAlert, {alertMessage}) => {
    return {
      type: 'alert-error',
      heading: alertMessage.heading,
      message: alertMessage.message
    }
  }),
  on(AlertActions.clearAlert, (state) => INITIAL_ALERT)
)
