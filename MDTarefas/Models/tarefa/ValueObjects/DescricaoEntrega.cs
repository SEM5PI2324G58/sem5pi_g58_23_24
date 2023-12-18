namespace MDTarefas.Models.tarefa.ValueObjects{
    public class DescricaoEntrega {
        public string DescricaoEntregaString { get; private set;} = null!;

        public DescricaoEntrega(string descricaoEntregaString) {
            this.DescricaoEntregaString = descricaoEntregaString;
        }
    }
}