import {TestBed} from '@angular/core/testing'
import {ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot} from '@angular/router'
import {MockStore, provideMockStore} from '@ngrx/store/testing'
import {newBuildSetGuard} from './new-build-set.guard'
import {editBuildSetGuard} from './edit-build-set.guard'
import {cloneBuildSetGuard} from './clone-build-set.guard'
import * as EditActions from '../state/edit-build-sets.actions'

describe('build set edit guards', () => {
  function run(guard: CanActivateFn, params: Record<string, string> = {}) {
    TestBed.configureTestingModule({providers: [provideMockStore()]})
    const dispatched = vi.spyOn(TestBed.inject(MockStore), 'dispatch')
    const route = {params} as unknown as ActivatedRouteSnapshot
    const allowed = TestBed.runInInjectionContext(() => guard(route, {} as RouterStateSnapshot))
    return {allowed, dispatched}
  }

  it('starts a new build set', () => {
    const {allowed, dispatched} = run(newBuildSetGuard)
    expect(allowed).toBe(true)
    expect(dispatched).toHaveBeenCalledWith(EditActions.newBuildSet())
  })

  it('loads the build set named in the route for editing', () => {
    const {allowed, dispatched} = run(editBuildSetGuard, {'build-set-name': 'main'})
    expect(allowed).toBe(true)
    expect(dispatched).toHaveBeenCalledWith(EditActions.loadBuildSetTemplate({name: 'main'}))
  })

  it('loads the build set named in the route for cloning', () => {
    const {allowed, dispatched} = run(cloneBuildSetGuard, {'build-set-name': 'main'})
    expect(allowed).toBe(true)
    expect(dispatched).toHaveBeenCalledWith(EditActions.loadBuildSetTemplateToClone({name: 'main'}))
  })

  it.each([
    ['edit', editBuildSetGuard],
    ['clone', cloneBuildSetGuard]
  ])('lets the %s page open without loading anything when no name is given', (_, guard) => {
    const {allowed, dispatched} = run(guard)
    expect(allowed).toBe(true)
    expect(dispatched).not.toHaveBeenCalled()
  })
})
