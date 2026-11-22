import {ServerEffects} from './server.effects'
import * as ServerActions from './server.actions'
import {backendErrorOccurred} from '../alerts/alert.actions'
import {API_ERROR, collect, setUpEffects} from '../../../../testing/effects'
import {someServers} from '../../../../testing/data'

describe('ServerEffects', () => {
  it('loads all servers', () => {
    const {effects, actions$, http} = setUpEffects(ServerEffects)
    const emitted = collect(effects.loadServers$)
    actions$.next(ServerActions.loadServers())
    http.expectOne({method: 'GET', url: '/api/v1/servers'}).flush(someServers())
    expect(emitted).toEqual([ServerActions.serversLoaded({servers: someServers()})])
    http.verify()
  })

  it('reports a failed load', () => {
    const {effects, actions$, http} = setUpEffects(ServerEffects)
    const emitted = collect(effects.loadServers$)
    actions$.next(ServerActions.loadServers())
    http.expectOne('/api/v1/servers').flush(API_ERROR, {status: 500, statusText: 'Server Error'})
    expect(emitted.map((a) => a.type)).toEqual([backendErrorOccurred.type])
  })

  it('saves a server and passes on what the API returns', () => {
    const {effects, actions$, http} = setUpEffects(ServerEffects)
    const emitted = collect(effects.updateSingleServer$)
    const server = {...someServers()[0], nickName: 'Renamed'}
    actions$.next(ServerActions.updateServer({server}))
    const req = http.expectOne({method: 'POST', url: '/api/v1/servers'})
    expect(req.request.body).toEqual(server)
    req.flush(server)
    expect(emitted).toEqual([ServerActions.serverUpdated({server})])
  })

  it('reports a failed save', () => {
    const {effects, actions$, http} = setUpEffects(ServerEffects)
    const emitted = collect(effects.updateSingleServer$)
    actions$.next(ServerActions.updateServer({server: someServers()[0]}))
    http.expectOne('/api/v1/servers').flush(API_ERROR, {status: 404, statusText: 'Not Found'})
    expect(emitted.map((a) => a.type)).toEqual([backendErrorOccurred.type])
  })
})
