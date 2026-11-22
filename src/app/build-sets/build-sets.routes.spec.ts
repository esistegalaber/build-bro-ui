import {TestBed} from '@angular/core/testing'
import {ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot} from '@angular/router'
import {MockStore, provideMockStore} from '@ngrx/store/testing'
import {buildSetRoutes} from './build-sets.routes'
import {loadBuildSetTemplates} from './state/build-sets.actions'

describe('build sets route', () => {
  it('loads the build sets before the page opens', () => {
    TestBed.configureTestingModule({providers: [provideMockStore()]})
    const store = TestBed.inject(MockStore)
    const dispatched = vi.spyOn(store, 'dispatch')
    const guard = buildSetRoutes[0].canActivate![0] as CanActivateFn
    const allowed = TestBed.runInInjectionContext(() => guard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot))
    expect(allowed).toBe(true)
    expect(dispatched).toHaveBeenCalledWith(loadBuildSetTemplates())
  })
})
