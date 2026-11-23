// Label definitions (build-bro-api#7). testdata.sql defines integration-test (enum ok/broken), jenkins-build (URL)
// and revision (64 hex characters), all for builds; every stored label fits them.
describe('Labels Page', () => {

  beforeEach(() => {
    cy.intercept({method: 'GET', pathname: '/api/v1/label-violations'}).as('violations')
    cy.visit('/labels')
    cy.wait('@violations')
  })

  it('Lists the definitions and the empty conformance report', () => {
    cy.get('[data-cy-id=label-definition]').should('have.length', 3)
    cy.get('[data-cy-id=label-definition]').first()
      .should('contain.text', 'Integration test')
      .and('contain.text', 'One of a list')
      .find('[data-cy-id=label-chip]').should('have.length', 2)
    cy.get('[data-cy-id=label-conformance] [data-cy-id=label-violations-none]').should('be.visible')
    cy.get('[data-cy-id=label-validation-OFF]').should('have.attr', 'aria-checked', 'true')
  })

  it('Previews a change, saves it and sees the labels that no longer fit', () => {
    cy.get('[data-cy-id=label-definition-edit]').first().click()
    // the form shows the definition as it is, including the style per value
    cy.get('[data-cy-id=label-value-style-broken]').should('have.value', 'ERROR')
    cy.get('[data-cy-id=label-allowed-values]').should('have.value', 'ok\nbroken').clear().type('ok')

    cy.intercept({method: 'PUT', pathname: '/api/v1/label-definitions/integration-test'}).as('preview')
    cy.get('[data-cy-id=label-preview]').click()
    cy.wait('@preview').its('request.url').should('contain', 'dryRun=true')
    cy.get('[data-cy-id=label-report]').should('contain.text', '1 value doesn’t fit this definition')
      .find('[data-cy-id=label-violation]').should('contain.text', 'broken')
    // nothing is saved yet
    cy.get('[data-cy-id=label-conformance] [data-cy-id=label-violations-none]').should('be.visible')

    cy.intercept({method: 'PUT', pathname: '/api/v1/label-definitions/integration-test'}).as('save')
    cy.get('[data-cy-id=label-save]').click()
    cy.wait('@save').its('request.url').should('not.contain', 'dryRun')
    cy.get('[data-cy-id=label-report]').should('contain.text', 'Saved.')
    cy.get('[data-cy-id=label-conformance] [data-cy-id=label-violation]').should('have.length', 1)
      .and('contain.text', 'broken').and('contain.text', 'value not allowed')
  })

  it('Creates a boolean definition with a style per value, and deletes it again', () => {
    cy.get('[data-cy-id=label-definition-new]').click()
    cy.get('[data-cy-id=label-key]').type('released')
    cy.get('[data-cy-id=label-type]').select('BOOLEAN')
    cy.get('[data-cy-id=label-applies-build]').uncheck()
    cy.get('[data-cy-id=label-value-style-true]').select('SUCCESS')

    cy.intercept({method: 'PUT', pathname: '/api/v1/label-definitions/released'}).as('save')
    cy.get('[data-cy-id=label-save]').click()
    cy.wait('@save').its('request.body').should('deep.include', {
      key: 'released', type: 'BOOLEAN', appliesTo: ['DEPLOYMENT'], valueStyles: {true: 'SUCCESS'}
    })
    cy.get('[data-cy-id=label-definition]').should('have.length', 4)
    cy.contains('[data-cy-id=label-definition]', 'released')
      .find('[data-label-style=SUCCESS]').should('contain.text', 'true')

    cy.contains('[data-cy-id=label-definition]', 'released').find('[data-cy-id=label-definition-delete]').click()
    cy.get('[data-cy-id=label-delete-dialog]').should('have.class', 'modal-open')
    cy.get('[data-cy-id=label-delete-confirm]').click()
    cy.get('[data-cy-id=label-definition]').should('have.length', 3)
  })

  it('Reports an inconsistent definition', () => {
    cy.get('[data-cy-id=label-definition-new]').click()
    cy.get('[data-cy-id=label-key]').type('stage')
    cy.get('[data-cy-id=label-type]').select('ENUM')
    cy.get('[data-cy-id=label-save]').click()
    cy.get('[data-cy-id=alert]').should('contain.text', "type ENUM needs allowedValues")
  })

  it('Switches to strict validation only after confirming, and back without asking', () => {
    cy.intercept({method: 'PUT', pathname: '/api/v1/label-settings'}).as('settings')
    cy.get('[data-cy-id=label-validation-STRICT]').click()
    cy.get('[data-cy-id=strict-confirmation-dialog]').should('have.class', 'modal-open')
      .and('contain.text', 'All stored labels fit')
    cy.get('[data-cy-id=strict-cancel]').click()
    cy.get('[data-cy-id=label-validation-OFF]').should('have.attr', 'aria-checked', 'true')

    cy.get('[data-cy-id=label-validation-STRICT]').click()
    cy.get('[data-cy-id=strict-confirm]').click()
    cy.wait('@settings').its('request.body').should('deep.equal', {labelValidation: 'STRICT'})
    cy.get('[data-cy-id=label-validation-STRICT]').should('have.attr', 'aria-checked', 'true')

    cy.get('[data-cy-id=label-validation-OFF]').click()
    cy.wait('@settings').its('request.body').should('deep.equal', {labelValidation: 'OFF'})
    cy.get('[data-cy-id=strict-confirmation-dialog]').should('not.have.class', 'modal-open')
  })
})
