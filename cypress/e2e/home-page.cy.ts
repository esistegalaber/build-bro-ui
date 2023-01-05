describe('Home Page', () => {
  it('Visits the initial project page', () => {
    cy.intercept({
      method: 'GET',
      url: '/api/v1/stats', // that have a URL that matches '/users/*'
    }).as('stats')
    cy.visit('/')
    cy.wait('@stats')
    cy.get('[data-cy-id=stats-hero]').should('be.visible')
  })
})
