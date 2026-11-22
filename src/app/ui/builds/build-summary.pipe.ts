import {Pipe, PipeTransform} from '@angular/core'
import {IBuild} from '../../core'

/** What a build row shows at a glance, taken from the build's labels. */
export interface BuildSummary {
  /** The value of the `integration-test` label (`ok`, `broken`, …), or null without one. */
  testStatus: string | null
  /** The first 12 characters of the `revision` label, or null without one. */
  revision: string | null
}

export function summarizeBuild(build: IBuild): BuildSummary {
  const value = (key: string) => build.labels.find((label) => label.key === key)?.value ?? null
  const revision = value('revision')
  return {
    testStatus: value('integration-test'),
    revision: revision ? revision.substring(0, 12) : null
  }
}

@Pipe({name: 'buildSummary'})
export class BuildSummaryPipe implements PipeTransform {
  transform(build: IBuild): BuildSummary {
    return summarizeBuild(build)
  }
}
