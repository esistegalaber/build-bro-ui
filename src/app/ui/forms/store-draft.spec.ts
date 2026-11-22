import {Component, input, output} from '@angular/core'
import {TestBed} from '@angular/core/testing'
import {storeDraft} from './store-draft'

interface Search {
  project: string
}

@Component({template: ''})
class Host {
  readonly fromStore = input.required<Search>()
  readonly changed = output<Search>()
  readonly draft = storeDraft(() => this.fromStore(), (search) => this.changed.emit(search))
}

describe('storeDraft', () => {
  async function render() {
    const fixture = TestBed.createComponent(Host)
    const fromStore = Object.freeze({project: ''})
    fixture.componentRef.setInput('fromStore', fromStore)
    const reported: Search[] = []
    fixture.componentInstance.changed.subscribe((s) => reported.push(s))
    await fixture.whenStable()
    const store = async (search: Search) => {
      fixture.componentRef.setInput('fromStore', Object.freeze(search))
      await fixture.whenStable()
    }
    return {fixture, draft: fixture.componentInstance.draft, fromStore, reported, store}
  }

  it('starts with the store\'s value and reports nothing', async () => {
    const {draft, fromStore, reported} = await render()
    expect(draft.model()).toBe(fromStore)
    expect(reported).toEqual([])
  })

  it('reports a change once, and not again when the store answers with it', async () => {
    const {fixture, draft, reported, store} = await render()
    draft.model.set({project: 'backend'})
    await fixture.whenStable()
    expect(reported).toEqual([{project: 'backend'}])
    await store({project: 'backend'})
    expect(reported).toHaveLength(1)
    expect(draft.model()).toEqual({project: 'backend'})
  })

  it('starts over when the store sends a new value, also over an edit not reported yet', async () => {
    const {draft, reported, store} = await render()
    draft.model.set({project: 'backend'})
    await store({project: 'frontend'})
    expect(draft.model()).toEqual({project: 'frontend'})
    expect(reported).toEqual([])
  })

  it('sends a value right away, and does not report it a second time', async () => {
    const {fixture, draft, reported} = await render()
    const search = {project: 'backend'}
    draft.model.set(search)
    draft.send(search)
    await fixture.whenStable()
    expect(reported).toEqual([search])
  })
})
