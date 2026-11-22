// Expects the API on :8080 with testdata.sql loaded (11 deployments: 10 on testserver, 1 on staging).
const deploymentsSearchRequest = {
  method: 'POST',
  url: '/api/v1/deployments/search',
}

describe('Deployments Page', () => {

  beforeEach(() => {
    cy.intercept(deploymentsSearchRequest).as('initial-search')
    cy.visit('/deployments')
    cy.wait('@initial-search').its('request.body')
      .should('deep.include', {serverName: '', page: 0, pageSize: 10})
  })

  it('Shows the first page of deployments', () => {
    cy.get('[data-cy-id^=deployment-]').should('have.length', 10)
    cy.get('[data-cy-id=paginator]').should('be.visible')
    cy.get('[data-cy-id=deployments-count]').should('contain.text', '11 deployments')
    // the newest deployment: testserver with 3 builds and two labels
    cy.get('[data-cy-id=row-of-deployment]').first()
      .should('contain.text', 'testserver · Tester')
      .and('contain.text', '3 builds')
      .find('[data-cy-id=labels-of-deployment]').should('contain.text', 'part-of-build-set = feature')
  })

  it('Pages through the deployments', () => {
    cy.intercept(deploymentsSearchRequest).as('last-page')
    cy.get('[data-cy-id=paginator-last]').click()
    cy.wait('@last-page').its('request.body').should('deep.include', {page: 1})
    cy.get('[data-cy-id^=deployment-]').should('have.length', 1)
  })

  it('Changes the page size', () => {
    cy.intercept(deploymentsSearchRequest).as('page-size')
    cy.get('[data-cy-id=page-size-select]').select('25')
    cy.wait('@page-size').its('request.body').should('deep.include', {pageSize: '25'})
    cy.get('[data-cy-id^=deployment-]').should('have.length', 11)
  })

  it('Filters deployments by server', () => {
    cy.intercept(deploymentsSearchRequest).as('server-search')
    cy.get('[data-cy-id=server-select]').select('staging')
    cy.wait('@server-search').its('request.body').should('deep.include', {serverName: 'staging'})
    cy.get('[data-cy-id^=deployment-]').should('have.length', 1)
      .parent().find('.collapse-title').should('contain.text', 'staging')
  })

  it('Resets the server filter and the page size', () => {
    cy.intercept(deploymentsSearchRequest).as('search')
    cy.get('[data-cy-id=server-select]').select('staging')
    cy.wait('@search').its('request.body').should('deep.include', {serverName: 'staging'})
    cy.get('[data-cy-id=page-size-select]').select('25')
    cy.wait('@search').its('request.body').should('deep.include', {serverName: 'staging', pageSize: '25'})

    cy.get('[data-cy-id=search-reset]').click()
    cy.wait('@search').its('request.body')
      .should('deep.include', {serverName: '', page: 0, pageSize: 10})
    cy.get('[data-cy-id=server-select]').should('have.value', '')
    cy.get('[data-cy-id=page-size-select]').find('option:selected').should('have.text', '10')
    cy.get('[data-cy-id^=deployment-]').should('have.length', 10)
  })

  it('Expands a deployment to show its labels and builds', () => {
    cy.get('[data-cy-id^=deployment-]').first().click()
      .parent().find('.collapse-content')
      .should('be.visible')
      .find('[data-cy-id^=build-]').should('have.length.at.least', 1)
  })
})
