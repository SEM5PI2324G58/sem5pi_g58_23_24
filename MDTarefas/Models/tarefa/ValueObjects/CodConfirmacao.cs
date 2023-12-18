namespace MDTarefas.Models.tarefa.ValueObjects
{
    public class CodConfirmacao
    {
        public string Codigo { get; private set; } = null!;

        public CodConfirmacao(string codigo)
        {
            this.Codigo = codigo;
        }
    }
}