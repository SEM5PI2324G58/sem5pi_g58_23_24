using MDTarefas.Models.tarefa.ValueObjects;

namespace MDTarefas.Models.tarefa
{
    public class PickUpDelivery : Tarefa
    {
        public CodConfirmacao CodConfirmacao { get; private set;} = null!;
        public DescricaoEntrega DescricaoEntrega { get; private set;} = null!;
        public Contacto ContactoPickUp { get; private set; } = null!;
        public Contacto ContactoDelivery { get; private set;} = null!;

        public PickUpDelivery(string codConfirmacao, string descricaoEntrega, 
                            string numeroPickUp, string nomePickUp, 
                            string numeroDelivery, string nomeDelivery,
                            string percurso, string email, string id ) : base(id, percurso, email) {
            
            this.CodConfirmacao = new CodConfirmacao(codConfirmacao);
            this.DescricaoEntrega = new DescricaoEntrega(descricaoEntrega);
            this.ContactoPickUp = new Contacto(new Nome(nomePickUp), new NumeroTelefone(numeroPickUp));
            this.ContactoDelivery = new Contacto(new Nome(nomeDelivery), new NumeroTelefone(numeroDelivery));

        }
    }
}