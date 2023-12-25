describe('Signup', () => {

    beforeEach(() => {

        cy.intercept('POST', '/api/user/signup').as('signup');
        cy.intercept('POST', '/api/user/login').as('login');

        //Criar um utilizador para testar o login
        cy.visit('/registar');
        cy.get('[name="name"]').type('UtilizadorTeste');
        cy.get('[name="password"]').type('Password10@');
        cy.get('[name="email"]').type('utilizadorTeste@isep.ipp.pt');
        cy.get('[name="telefone"]').type('912345678');
        cy.get('[name="role"]').select('gestor de campus');
        cy.get('button').click();
        cy.wait('@signup')

    });

    it('login tem sucesso', () => {
        cy.visit('/login');
        cy.get('[name="email"]').type('utilizadorTeste@isep.ipp.pt');
        cy.get('[name="password"]').type('Password10@');
        cy.get('button').click();
        cy.wait('@login').then((interception) => {
            expect(interception?.response?.statusCode).to.equal(200);
        });

    });

    afterEach(() => {
        //TODO apagar utilizador
    });
})
