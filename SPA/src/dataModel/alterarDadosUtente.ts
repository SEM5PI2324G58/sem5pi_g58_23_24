export default interface AlterarDadosUtente{
    //TODO remover o email(passar a ser obtio pelo token)
    email: string,
    name?: string,
    telefone?: string,
    nif?: string
}