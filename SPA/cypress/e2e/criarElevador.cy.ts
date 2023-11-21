describe('Criar elevador', () => {

    beforeEach(() => {
        
        cy.intercept('POST', '/api/edificio').as('createEdificio');
        cy.intercept('GET', '/api/edificio').as('getEdificio');
        cy.intercept('POST', '/api/piso').as('createPiso');
        cy.intercept('GET', '/api/piso?codigo=T1').as('getPisosEdificio');
        cy.intercept('POST', '/api/elevador').as('createElevador');
        
        //Criar um edificio
        cy.visit('/criarEdificio')
        cy.get('[name="codigo"]').type('T1');
        cy.get('[name="nomeEdificio"]').type('Nome1');
        cy.get('[name="descricaoEdificio"]').type('Descricao1');
        cy.get('[name="dimensaoX"]').type('3');
        cy.get('[name="dimensaoY"]').type('3');
        cy.get('button').click();
        cy.wait('@createEdificio');


        //Criar 2 pisos
        cy.visit('/criarPiso');
        cy.wait('@getEdificio');

        cy.get('[id="codigo"]').select('T1');
        cy.get('[name="numeroPiso"]').type('1');
        cy.get('[name="descricaoPiso"]').type('Descricao1');

        cy.get('button').click({ multiple: true });
        cy.wait('@createPiso');

        cy.get('[name="numeroPiso"]').clear().type('2');
        
        cy.get('button').click({ multiple: true });
        cy.wait('@createPiso');

    });
    
    it('Criar elevador sucesso e2e', () => {
        //Criar elevdor
        cy.visit('/criarElevador');
        cy.wait('@getEdificio');
    
        cy.get('[id="codigo"]').select('T1');
        cy.wait('@getPisosEdificio');
    
    
        cy.get('.multiselect').click(); 
        cy.get('.dropdown-list').contains('1').click();
        cy.get('.dropdown-list').contains('2').click(); 
        cy.get('.multiselect').click(); 
        cy.get('[name="marca"]').type('Marca1');
        cy.get('[name="modelo"]').type('Modelo1');
        cy.get('[name="numeroSerie"]').type('1234');
        cy.get('[name="descricao"]').type('Descricao1');
    
        cy.get('button').click();
        cy.wait('@createElevador');
    
        cy.get('[name="app-message"]').contains('Elevador no edifício T1 criado com sucesso!');
    })

    afterEach(() => {
        cy.visit('/apagarEdificio');
        cy.get('[name="codigo"]').type('T1');
        cy.get('button').click();
    });
})
