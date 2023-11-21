describe('Tipo de Robo', () => {

    beforeEach(() => {
        
        cy.intercept('POST', '/api/tipoDispositivo').as('createTipoRobo');
    });
    
    it('Criar tipo de robot com sucesso', () => {
        cy.visit('/criarTipoRobo')
        cy.get('[name="marcaTipoRobo"]').type('marca');
        cy.get('[name="modeloTipoRobo"]').type('modelo');
        cy.get('.checkbox input[type="checkbox"]').each(($checkbox) => {
            cy.wrap($checkbox).check();
        });
        cy.get('button').click();
        cy.wait('@createTipoRobo').then((interception) => {
            expect(interception?.response?.statusCode).to.eq(201); // Adjust the status code as needed
        });
       
    })

    afterEach(() => {
        //TODO: apagar tipo de robot
    });
})
