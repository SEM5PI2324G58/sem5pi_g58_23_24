/*describe('Signup', () => {

    beforeEach(() => {

        cy.intercept('POST', '/api/user/signup').as('signup');

    });

    it('Signup input load de pagina', () => {
        cy.visit('/signup');

        cy.get('[name="name"]').should('have.attr', 'placeholder', 'Nome do Utilizador *');
        cy.get('[name="password"]').should('have.attr', 'placeholder', 'Password do Utilizador *');
        cy.get('[name="email"]').should('have.attr', 'placeholder', 'Email do Utilizador *');
        cy.get('[name="telefone"]').should('have.attr', 'placeholder', 'Telefone do Utilizador *');
        cy.get('[name="role"]').find('option').first().should('have.text', 'Role do Utilizador *');
        cy.get('[name="nif"]').should('have.attr', 'placeholder', 'Numero de Contribuinte do Utilizador ');
        cy.get('select[name="role"]').select('utente');
        cy.get('[name="nif"]').should('exist');
    });

 
    it('deve exibir o campo de seleção de role com as opções corretas', () => {
        cy.visit('/signup');

        cy.get('select[name="role"]').should('exist');
        cy.get('select[name="role"] option').should('have.length', 6); // Incluindo a opção desativada
        cy.get('select[name="role"] option').eq(1).should('have.value', 'Gestor de Campus');
        cy.get('select[name="role"] option').eq(2).should('have.value', 'Gestor de Frota');
        cy.get('select[name="role"] option').eq(3).should('have.value', 'Gestor de Tarefas');
        cy.get('select[name="role"] option').eq(4).should('have.value', 'Utente');
        cy.get('select[name="role"] option').eq(5).should('have.value', 'Administrador');
    });
    
    it('deve exibir o campo NIF quando o role "utente" está selecionado', () => {
        cy.visit('/signup');
        cy.get('select[name="role"]').select('utente');
        cy.get('input[name="nif"]').should('exist');
    });
    
    it('não deve exibir o campo NIF quando outro role está selecionado', () => {
        cy.visit('/signup');
        cy.get('select[name="role"]').select('gestor de campus');
        cy.get('input[name="nif"]').should('not.exist');
    });
    

    it('Signup falha sem inserir informação', () => {
        cy.visit('/signup');
        cy.get('[id="checkbox"]').check();
        cy.get('button').click();

        cy.get('[name="app-message"]').contains("Preencha todos os campos");

    });

    afterEach(() => {

    });
})*/
