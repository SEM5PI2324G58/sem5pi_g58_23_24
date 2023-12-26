describe('Criar elevador', () => {

    beforeEach(() => {
        cy.intercept('POST', '/api/Tarefa').as('createTarefa');
        cy.intercept('GET', '/api/edificio').as('getEdificio');
        cy.intercept('GET', '/api/piso?codigo=A').as('getPisosEdificio');
    });
    
    it('Criar vigilância sucesso e2e', () => {
        cy.visit('/criarTarefaVigilancia');
        
        cy.wait('@getEdificio')
        cy.get('[id="codigoEd"]').select('A');
        
        cy.wait('@getPisosEdificio')
        cy.get('[name="numeroPiso"]').select('1');

        cy.get('[name="nomeVigilancia"]').type('ABC');
        cy.get('[name="numeroVigilancia"]').type('123456789');


        cy.get('button').click();
        cy.wait('@createTarefa').then((interception) => {
            expect(interception?.response?.statusCode).to.eq(201);
        })
    })

    afterEach(() => {        
        //TODO apagar tarefa
    });
})
