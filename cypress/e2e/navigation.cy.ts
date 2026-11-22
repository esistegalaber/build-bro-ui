describe('Navigation', () => {
  const pages = [
    {nav: 'nav-home', path: '/home', request: null},
    {nav: 'nav-build-sets', path: '/build-sets', request: {method: 'GET', pathname: '/api/v1/build-sets'}},
    {nav: 'nav-builds', path: '/builds', request: {method: 'POST', url: '/api/v1/builds/search'}},
    {nav: 'nav-servers', path: '/servers', request: null},
    {nav: 'nav-deployments', path: '/deployments', request: {method: 'POST', url: '/api/v1/deployments/search'}},
    {nav: 'nav-projects', path: '/projects', request: null},
  ]

  it('Switches the theme and keeps it after a reload', () => {
    cy.visit('/home')
    cy.get('#bb-html').should('have.attr', 'data-theme', 'light')
    cy.get('[data-cy-id=theme-light]').should('have.attr', 'aria-pressed', 'true')
    cy.get('[data-cy-id=theme-dark]').click()
    cy.get('#bb-html').should('have.attr', 'data-theme', 'dark')
    cy.get('[data-cy-id=theme-dark]').should('have.attr', 'aria-pressed', 'true')
    cy.reload()
    cy.get('#bb-html').should('have.attr', 'data-theme', 'dark')
    cy.get('[data-cy-id=theme-lagoon]').click()
    cy.get('#bb-html').should('have.attr', 'data-theme', 'lagoon')
  })

  it('Collapses the side nav to icons and expands it again', () => {
    cy.visit('/home')
    cy.get('[data-cy-id=nav-builds]').should('contain.text', 'Builds')
      .find('.sr-only').should('not.exist')
    cy.get('[data-cy-id=side-nav-toggle]').should('have.attr', 'aria-expanded', 'true').click()
    cy.get('[data-cy-id=side-nav-toggle]').should('have.attr', 'aria-expanded', 'false')
    cy.get('[data-cy-id=nav-builds] .sr-only').should('have.text', 'Builds')
    cy.get('[data-cy-id=side-nav-toggle]').click()
    cy.get('[data-cy-id=nav-builds] .sr-only').should('not.exist')
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
      cy.get(`[data-cy-id=${nav}]`).should('have.attr', 'aria-current', 'page')
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
