import {EnvironmentProviders, Provider, Type} from '@angular/core'
import {TestBed} from '@angular/core/testing'
import {provideHttpClient} from '@angular/common/http'
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing'
import {Action} from '@ngrx/store'
import {provideMockActions} from '@ngrx/effects/testing'
import {MockSelector, MockStore, provideMockStore} from '@ngrx/store/testing'
import {Observable, Subject} from 'rxjs'

/**
 * Sets up an effects class for a test: actions come from a Subject, HTTP goes to HttpTestingController,
 * and the store is a MockStore whose selectors return the given values.
 */
export function setUpEffects<T>(effectsClass: Type<T>, options: {
  selectors?: MockSelector[],
  providers?: (Provider | EnvironmentProviders)[]
} = {}) {
  const actions$ = new Subject<Action>()
  TestBed.configureTestingModule({
    providers: [
      effectsClass,
      provideMockActions(() => actions$),
      provideMockStore({selectors: options.selectors ?? []}),
      provideHttpClient(),
      provideHttpClientTesting(),
      ...(options.providers ?? [])
    ]
  })
  return {
    effects: TestBed.inject(effectsClass),
    actions$,
    http: TestBed.inject(HttpTestingController),
    store: TestBed.inject(MockStore)
  }
}

/** Collects everything an effect emits while the test runs. */
export function collect(effect$: Observable<Action>): Action[] {
  const emitted: Action[] = []
  effect$.subscribe((action) => emitted.push(action))
  return emitted
}

/** The body the API sends with an error (its IExceptionInfo). */
export const API_ERROR = {key: 'not-found', description: 'No such data', message: 'Nothing found'}
