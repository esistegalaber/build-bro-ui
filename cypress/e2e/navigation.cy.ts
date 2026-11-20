describe('Navigation', () => {
  const pages = [
    {nav: 'nav-build-sets', path: '/build-sets', request: {method: 'GET', url: '/api/v1/build-sets/names'}},
    {nav: 'nav-builds', path: '/builds', request: {method: 'POST', url: '/api/v1/builds/search'}},
    {nav: 'nav-servers', path: '/servers', request: null},
    {nav: 'nav-deployments', path: '/deployments', request: {method: 'POST', url: '/api/v1/deployments/search'}},
    {nav: 'nav-projects', path: '/projects', request: null},
  ]

  it('Switches the theme and toggles the side nav labels', () => {
    cy.visit('/home')
    cy.get('[data-cy-id=theme-select]').select('dark')
    cy.get('#bb-html').should('have.attr', 'data-theme', 'dark')
    cy.get('[data-cy-id=nav-builds]').invoke('text').then((before) => {
      cy.get('[data-cy-id=side-nav-toggle]').click()
      cy.get('[data-cy-id=nav-builds]').invoke('text').should('not.eq', before)
    })
  })

  it('Redirects the root url to the home page', () => {
    cy.visit('/')
    cy.location('pathname').should('eq', '/home')
    cy.get('[data-cy-id=stats-hero]').should('be.visible')
  })

  pages.forEach(({nav, path, request}) => {
    it(`Opens ${path} from the side navigation`, () => {
      cy.visit('/home')
      if (request) {
        cy.intercept(request).as('page-load')
      }
      cy.get(`[data-cy-id=${nav}]`).click()
      cy.location('pathname').should('eq', path)
      if (request) {
        cy.wait('@page-load')
      }
    })
  })

  it('Redirects /edit-build-set to the new build set form', () => {
    cy.visit('/edit-build-set')
    cy.location('pathname').should('eq', '/edit-build-set/new')
    cy.get('[data-cy-id=build-set-name-input]').should('have.value', '')
  })
})
