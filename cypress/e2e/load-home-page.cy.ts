describe('Load Home Page', () => {
  it('Visits the initial project page', () => {
    cy.intercept({
        method: 'GET',
        url: '/api/v1/stats', // that have a URL that matches '/users/*'
      }, {fixture: 'stats/build-stats.json'}
    ).as('stats')
    cy.visit('/')
    cy.wait('@stats')
    cy.get('[data-test-id=build-bro-home]')
  })
})
