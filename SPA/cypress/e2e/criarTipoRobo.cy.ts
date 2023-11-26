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
        cy.get('[name="app-message"]').invoke('text').then((text) => {
            const regex = /Tipo de Robot com id (\w+) criado com sucesso!/;
            const match = text.match(regex);
            
            if (match) {
              let id = match[1];
              cy.intercept('DELETE', '/api/tipoDispositivo?idTipoDispositivo='+id).as('apagarTipoRobo');

              cy.visit('/apagarTipoRobo');
              cy.get('[name="id"]').type(id);
              cy.get('button').click();
              cy.wait('@apagarTipoRobo');
            } else {
              cy.log('Erro');
            }
        });
    })

    afterEach(() => {
        //TODO: apagar tipo de robot
    });
})
