import {TestBed} from '@angular/core/testing'
import {DeploymentList} from './deployment.list'
import {IDeployment, ILabelDefinition} from '../../core'
import {aBooleanDefinition, build, someServers} from '../../../testing/data'

describe('DeploymentList', () => {
  const deployment = (id: number, serverName: string, builds: number, labels: [string, string][] = []): IDeployment => ({
    id, serverName, deployedAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
    builds: Array.from({length: builds}, (_, i) => build(100 * id + i, `service-${i + 1}`, 'main', i + 1)),
    labels: labels.map(([key, value], i) => ({id: i, key, value}))
  })

  async function render(deployments: IDeployment[], labelDefinitions: ILabelDefinition[] = []) {
    const fixture = TestBed.createComponent(DeploymentList)
    fixture.componentRef.setInput('deployments', deployments)
    fixture.componentRef.setInput('servers', someServers())
    fixture.componentRef.setInput('labelDefinitions', labelDefinitions)
    await fixture.whenStable()
    const el = fixture.nativeElement as HTMLElement
    return {el, rows: () => Array.from(el.querySelectorAll('[data-cy-id=row-of-deployment]')) as HTMLElement[]}
  }

  it('shows server, nickname, relative and exact time and the number of builds, but not the labels', async () => {
    const {rows} = await render([deployment(1, 'testserver', 3, [['part-of-build-set', 'main']])])
    const text = rows()[0].querySelector('.collapse-title')!.textContent!.replace(/\s+/g, ' ')
    expect(text).toContain('testserver · Tester')
    expect(text).toContain('3 days ago')
    expect(text).toMatch(/\d{4}/)
    expect(text).not.toContain('part-of-build-set')
    expect(rows()[0].querySelector('.collapse-title [data-cy-id=label-chip]')).toBeNull()
    expect(rows()[0].querySelector('[data-cy-id=builds-of-deployment]')?.textContent?.trim()).toBe('3 builds')
  })

  it('keeps a deployment with many builds to one line, with the builds in the expandable part', async () => {
    const {rows} = await render([deployment(1, 'staging', 20), deployment(2, 'prod-1', 1)])
    expect(rows()[0].querySelector('[data-cy-id=builds-of-deployment]')?.textContent?.trim()).toBe('20 builds')
    expect(rows()[0].querySelector('.collapse-title [data-cy-id^=build-]')).toBeNull()
    expect(rows()[0].querySelectorAll('.collapse-content [data-cy-id=build-row]')).toHaveLength(20)
    expect(rows()[1].querySelector('[data-cy-id=builds-of-deployment]')?.textContent?.trim()).toBe('1 build')
    // prod-1 isn't among the known servers, so it has no nickname
    expect(rows()[1].querySelector('.collapse-title .font-semibold')?.textContent?.trim()).toBe('prod-1')
  })

  it('has an accessible expand checkbox', async () => {
    const {el} = await render([deployment(1, 'testserver', 1)])
    expect(el.querySelector('[data-cy-id=deployment-1]')?.getAttribute('aria-label')).toBe('Show the builds of the deployment to testserver')
  })

  it('hands the label definitions on to the builds', async () => {
    const d = deployment(1, 'testserver', 1, [['Released', 'true'], ['part-of-build-set', 'main']])
    d.builds[0].labels = [{id: 1, key: 'released', value: 'false'}]
    const {rows} = await render([d], [aBooleanDefinition()])
    const buildLabel = rows()[0].querySelector('.collapse-content dd [data-cy-id=label-chip]') as HTMLElement
    expect(buildLabel.querySelector('.material-icons')?.textContent).toBe('cancel')
  })
})
