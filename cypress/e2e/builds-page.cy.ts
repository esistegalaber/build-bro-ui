const buildsSearchRequest = {
  method: 'POST',
  url: '/api/v1/builds/search',

}
describe('Builds Page', () => {

  it('Search Builds of Project "backend"', () => {
    loadBuildPage()
    loadLastPage()
    selectBackofficeProject()
    selectMainBranch()
  })

  it('Pages through the results with first / previous / next / last', () => {
    loadBuildPage()
    cy.get('[data-cy-id=paginator-current]').should('contain.text', '1 / 9')
    cy.get('[data-cy-id=paginator-next]').click()
    cy.get('[data-cy-id=paginator-current]').should('contain.text', '2 / 9')
    cy.get('[data-cy-id=paginator-last]').click()
    cy.get('[data-cy-id=paginator-current]').should('contain.text', '9 / 9')
    cy.get('[data-cy-id=paginator-previous]').click()
    cy.get('[data-cy-id=paginator-current]').should('contain.text', '8 / 9')
    cy.get('[data-cy-id=paginator-first]').click()
    cy.get('[data-cy-id=paginator-current]').should('contain.text', '1 / 9')
  })

  it('Adds and removes a search label', () => {
    loadBuildPage()
    cy.intercept(buildsSearchRequest).as('label-search')
    cy.get('[data-cy-id=label-key-input]').type('integration-test')
    cy.get('[data-cy-id=label-add]').should('be.disabled')
    cy.get('[data-cy-id=label-value-input]').type('ok')
    cy.get('[data-cy-id=label-add]').should('be.enabled').click()
    cy.wait('@label-search').its('request.body.labels').should('deep.equal', {'integration-test': 'ok'})
    cy.get('[data-cy-id=search-label]').should('have.length', 1)
      .and('contain.text', 'integration-test = ok')

    cy.get('[data-cy-id=search-label-remove]').click()
    cy.wait('@label-search').its('request.body.labels').should('deep.equal', {})
    cy.get('[data-cy-id=search-label]').should('not.exist')
  })

  // Reset and (Re-)Load sit inside the search <form>: only (Re-)Load may submit it, or a click also
  // re-sends the old search before the form has received the reset values.
  it('Resets the search', () => {
    loadBuildPage()
    cy.intercept(buildsSearchRequest).as('min-search')
    cy.get('[data-cy-id=min-build-number-input]').type('5')
    cy.wait('@min-search').its('request.body.minBuildNumber').should('eq', 5)
    cy.get('[data-cy-id=search-reset]').click()
    cy.wait('@min-search').its('request.body').should('deep.include', {minBuildNumber: null, page: 0, pageSize: 10})
    cy.get('[data-cy-id=min-build-number-input]').should('have.value', '')
  })

  it('(Re-)Load sends the search once, and Enter in a field does not reset it', () => {
    loadBuildPage()
    cy.get('[data-cy-id=min-build-number-input]').type('5')
    let searches = 0
    cy.intercept(buildsSearchRequest, () => {
      searches++
    }).as('reload')
    cy.get('[data-cy-id=search-reload]').click()
    cy.wait('@reload').its('request.body.minBuildNumber').should('eq', 5)
    cy.wait(500).then(() => expect(searches).to.eq(1))
    cy.get('[data-cy-id=min-build-number-input]').type('{enter}')
    cy.wait('@reload').its('request.body.minBuildNumber').should('eq', 5)
    cy.get('[data-cy-id=min-build-number-input]').should('have.value', '5')
  })

  // #50: with a slow API, a quickly typed number must neither lose characters nor end on the results of an older search
  it('Shows the results of the last typed build number, even when an older search answers late', () => {
    loadBuildPage()
    // the search for "9" answers only after 1.5 s; the handler then passes the request on to the API
    cy.intercept(buildsSearchRequest, (req) => new Promise<void>((resolve) =>
      setTimeout(resolve, req.body.minBuildNumber === 9 ? 1500 : 0))).as('search')
    cy.get('[data-cy-id=min-build-number-input]').type('9')
    cy.wait(400) // typing pauses: the slow search for "9" starts
    cy.get('[data-cy-id=min-build-number-input]').type('99')

    cy.get('[data-cy-id=min-build-number-input]').should('have.value', '999')
    cy.get('[data-cy-id=builds-empty]').should('be.visible')
    cy.get('[data-cy-id=builds-count]').should('contain.text', '0 builds')
    // the late answer for "9" must not replace the results
    cy.wait(1600)
    cy.get('[data-cy-id=builds-empty]').should('be.visible')
    cy.get('[data-cy-id=min-build-number-input]').should('have.value', '999')
    cy.get('@search.all').then((searches) => {
      const typed = searches.map((s) => (s as unknown as { request: { body: { minBuildNumber: number } } }).request.body.minBuildNumber)
      expect(typed).to.deep.equal([9, 999])
    })
  })

  function loadBuildPage() {
    cy.intercept(buildsSearchRequest).as('empty-search-response')
    // open builds page
    cy.visit('/builds')
    cy.wait('@empty-search-response')
    //check the visible builds
    cy.get('[data-cy-id=build-10]').should('exist')
  }

  function loadLastPage() {
    //intercept search call
    cy.intercept(buildsSearchRequest).as('paginator-last')
    // click 'last' button
    cy.get('[data-cy-id=paginator-last]').click()
      .wait('@paginator-last')
      .its('request.body').should('contain', {"page": 8})
    //check the visible builds
    cy.get('[data-cy-id=build-81]').should('exist')
  }

  function selectBackofficeProject() {
    // select the backoffice project
    cy.intercept(buildsSearchRequest).as('backoffice-search-response')
    cy.get('[data-cy-id=project-select]')
      .select('backoffice')
      .wait('@backoffice-search-response')
      .its('request.body')
      .should('contain', {"project": "backoffice", "page": 0});

    cy.get('[data-cy-id=build-70]').should('exist')
      .click()
  }

  function selectMainBranch() {
    // select the backoffice project
    cy.intercept(buildsSearchRequest).as('backoffice-main-response')
    cy.get('[data-cy-id=branch-select]')
      .select('next')
      .wait('@backoffice-main-response')
      .its('request.body')
      .should('contain', {"project": "backoffice", "branch": "next", "page": 0});
    cy.get('[data-cy-id=build-71]').should('exist')
      .click()
  }
})
