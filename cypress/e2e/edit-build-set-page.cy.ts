// Expects the API on :8080 with testdata.sql loaded.
// The create/delete test cleans up after itself, so the suite can be re-run against the same data.
describe('Edit Build Set Page', () => {

  it('Loads an existing build set and verifies its builds', () => {
    cy.intercept({method: 'GET', url: '/api/v1/build-sets/main'}).as('template')
    cy.intercept({method: 'POST', url: '/api/v1/build-sets/verify'}).as('verify')
    cy.visit('/edit-build-set/main')
    cy.wait('@template')
    cy.wait('@verify')

    cy.get('[data-cy-id=build-set-name-input]').should('have.value', 'main')
    cy.get('[data-cy-id=build-template-backend]').within(() => {
      cy.get('[data-cy-id=project-toggle]').should('be.checked')
      cy.get('[data-cy-id=template-branch-select]').find('option:selected').should('have.text', 'main')
    })
    cy.get('[data-cy-id=build-template-backoffice] [data-cy-id=project-toggle]').should('not.be.checked')
    // backend main #9 (pinned) and the latest frontend main build
    cy.get('[data-cy-id=build-9]').should('exist')
    cy.get('[data-cy-id=build-40]').should('exist')
  })

  it('Sends a label filter with the verification', () => {
    cy.intercept({method: 'POST', url: '/api/v1/build-sets/verify'}).as('verify')
    cy.visit('/edit-build-set/main')
    cy.wait('@verify')
    cy.get('[data-cy-id=build-template-backend] [data-cy-id=template-labels]').type('integration-test=ok').blur()
    cy.wait('@verify').its('request.body').should((body) => {
      expect(body.find((t: { project: string }) => t.project === 'backend').labels).to.deep.equal({'integration-test': 'ok'})
    })
    // backend main #9 is pinned and has integration-test=ok, so it still resolves to #9
    cy.get('[data-cy-id=resolved-backend]').should('contain.text', '#9')
  })

  it('Prefills the clone form with a CLONE-OF name', () => {
    cy.intercept({method: 'GET', url: '/api/v1/build-sets/main'}).as('template')
    cy.visit('/edit-build-set/clone/main')
    cy.wait('@template')
    cy.get('[data-cy-id=build-set-name-input]').should('have.value', 'CLONE-OF-main')
    cy.get('[data-cy-id=build-template-backend] [data-cy-id=project-toggle]').should('be.checked')
  })

  // The edit page keeps its store state between visits, so the next build set is first rendered with the
  // previous one's templates. The template cards are reused (tracked by project id) and must show the new values.
  it('Shows the right values after switching to another build set', () => {
    cy.intercept({method: 'GET', url: '/api/v1/build-sets/main'}).as('main')
    cy.visit('/edit-build-set/main')
    cy.wait('@main')
    cy.get('[data-cy-id=build-template-backend]').within(() => {
      cy.get('[data-cy-id=project-toggle]').should('be.checked')
      cy.get('[data-cy-id=template-branch-select]').find('option:selected').should('have.text', 'main')
      cy.get('input[name=buildNumber]').should('have.value', '9')
    })

    cy.intercept({method: 'GET', url: '/api/v1/build-sets/feature-test-stage-1'}).as('other')
    cy.get('[data-cy-id=nav-build-sets]').click()
    cy.get('[data-cy-id="build-set-name-feature-test-stage-1"]').click()
    cy.get('[data-cy-id=build-set-edit]').click()
    cy.wait('@other')
    cy.get('[data-cy-id=build-set-name-input]').should('have.value', 'feature-test-stage-1')
    cy.get('[data-cy-id=project-toggle]').should('have.length', 3).and('not.be.checked')
    // excluded projects are a single line without fields
    cy.get('[data-cy-id=build-template-backend]').should('contain.text', 'Not included')
      .find('input[name=buildNumber]').should('not.exist')

    cy.get('[data-cy-id=nav-build-sets]').click()
    cy.get('[data-cy-id="build-set-name-main"]').click()
    cy.get('[data-cy-id=build-set-edit]').click()
    cy.wait('@main')
    cy.get('[data-cy-id=build-template-backend]').within(() => {
      cy.get('[data-cy-id=project-toggle]').should('be.checked')
      cy.get('[data-cy-id=template-branch-select]').find('option:selected').should('have.text', 'main')
      cy.get('input[name=buildNumber]').should('have.value', '9')
    })
    cy.get('[data-cy-id=build-template-frontend] [data-cy-id=project-toggle]').should('be.checked')
    cy.get('[data-cy-id=build-template-backoffice] [data-cy-id=project-toggle]').should('not.be.checked')
  })

  it('Creates a new build set and deletes it again', () => {
    const name = `cy-e2e-${Date.now()}`

    // the project rows need the projects, which the app loads on start (slow on a cold API)
    cy.intercept({method: 'GET', url: '/api/v1/projects'}).as('projects')
    cy.visit('/edit-build-set/new')
    cy.wait('@projects')
    cy.get('[data-cy-id=build-set-name-input]').should('have.value', '')
    cy.get('[data-cy-id=build-set-save]').should('be.disabled')

    // add the backoffice project and pick its 'next' branch
    cy.intercept({method: 'POST', url: '/api/v1/build-sets/verify'}).as('verify')
    // the template cards are tracked by project id, so the toggle updates the existing card in place
    cy.get('[data-cy-id=build-template-backoffice]').within(() => {
      cy.get('[data-cy-id=project-toggle]').click().should('be.checked')
      cy.get('[data-cy-id=template-branch-select]').should('be.visible').select('next')
    })
    cy.wait('@verify').its('request.body').should('deep.equal', [
      {project: 'backoffice', branch: 'next', labels: {}, buildNumber: null}
    ])

    // save it
    cy.intercept({method: 'POST', url: '/api/v1/build-sets'}).as('save')
    cy.get('[data-cy-id=build-set-name-input]').type(name)
    cy.get('[data-cy-id=build-set-save]').should('be.enabled').click()
    cy.wait('@save').then((interception) => {
      expect(interception.request.body.name).to.eq(name)
      expect(interception.request.body.buildTemplates).to.have.length(1)
      expect(interception.response?.statusCode).to.eq(200)
    })
    cy.get('[data-cy-id=alert]').should('contain.text', 'Saved')
    cy.get('[data-cy-id=alert-ok]').click()
    cy.get('[data-cy-id=alert]').should('not.exist')

    // it now shows up on the build sets page; delete it from there
    cy.intercept({method: 'GET', pathname: '/api/v1/build-sets'}).as('build-sets')
    cy.get('[data-cy-id=nav-build-sets]').click()
    cy.wait('@build-sets')
    cy.get(`[data-cy-id="build-set-name-${name}"]`).click()
    cy.get('[data-cy-id=build-set-card]').should('contain.text', `Builds of ${name}`)

    cy.intercept({method: 'DELETE', url: `/api/v1/build-sets/${name}`}).as('delete')
    cy.get('[data-cy-id=build-set-delete]').click()
    cy.get('[data-cy-id=delete-confirmation-dialog]').should('be.visible').and('contain.text', name)
    cy.get('[data-cy-id=delete-confirm]').click()
    cy.wait('@delete')
    cy.get(`[data-cy-id="build-set-name-${name}"]`).should('not.exist')
    cy.get('[data-cy-id=build-set-card]').should('not.exist')
  })
})
