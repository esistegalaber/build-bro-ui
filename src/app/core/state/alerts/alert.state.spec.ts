import {HttpErrorResponse} from '@angular/common/http'
import {alertReducer, INITIAL_ALERT} from './alert.state'
import * as AlertActions from './alert.actions'

describe('alertReducer', () => {
  it('starts without an alert', () => {
    expect(alertReducer(undefined, {type: '@@init'})).toEqual(INITIAL_ALERT)
  })

  it('shows the message and description of an API error', () => {
    const errorResponse = new HttpErrorResponse({
      status: 404, error: {key: 'not-found', description: 'No such data', message: 'No Environment found'}
    })
    expect(alertReducer(INITIAL_ALERT, AlertActions.backendErrorOccurred({errorResponse}))).toEqual({
      type: 'alert-error', heading: 'No such data', message: 'No Environment found'
    })
  })

  it('falls back to the HTTP status when the error has no message', () => {
    const errorResponse = new HttpErrorResponse({status: 502, error: 'Bad Gateway'})
    expect(alertReducer(INITIAL_ALERT, AlertActions.backendErrorOccurred({errorResponse}))).toEqual({
      type: 'alert-error', heading: 'Unexpected Error: 502', message: 'An unexpected error occurred. 502'
    })
  })

  it('shows an info message', () => {
    const alertMessage = {heading: 'Saved', message: 'Successfully saved'}
    expect(alertReducer(INITIAL_ALERT, AlertActions.frontendInfo({alertMessage})))
      .toEqual({type: 'alert-info', heading: 'Saved', message: 'Successfully saved'})
  })

  it('clears the alert', () => {
    const shown = alertReducer(INITIAL_ALERT, AlertActions.frontendInfo({alertMessage: {heading: 'h', message: 'm'}}))
    expect(alertReducer(shown, AlertActions.clearAlert())).toEqual(INITIAL_ALERT)
  })
})
