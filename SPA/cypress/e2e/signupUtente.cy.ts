describe('Signup Utente', () => {

    beforeEach(() => {
        
        cy.intercept('POST', '/api/user/signupUtente').as('signupUtente');

    });

    it('Signup utente input load de pagina', () => {
        cy.visit('/signupUtente')

        cy.get('[name="name"]').should('have.attr', 'placeholder', 'Nome *');
        cy.get('[name="email"]').should('have.attr', 'placeholder', 'Email *');
        cy.get('[name="telemovel"]').should('have.attr', 'placeholder', 'Número de Telefone *');
        cy.get('[name="nif"]').should('have.attr', 'placeholder', 'Número de Contribuinte *');
        cy.get('[name="password"]').should('have.attr', 'placeholder','Password *');


    });

    it('Signup utente falha sem inserir informação', () => {
        cy.visit('/signupUtente');

        cy.get('button').click();

        cy.get('[name="app-message"]').contains("Preencha todos os campos");
 
    });
    


    afterEach(() => {
      
    });
})
