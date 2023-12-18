namespace MDTarefas.dto;

public class TarefaDTO
{
    public string TipoTarefa { get; set; } = null!; // "PickUpDelivery" or "Vigilancia"
    // For both types of Tarefa
    public string Id { get; set; } = null!;
    public string PercursoString { get; set; } = null!;
    public string EstadoString { get; set; } = null!;
    public string EmailRequisitor { get; set; } = null!;
    // For PickUp&Delivery
    public string? CodConfirmacao { get; set; }
    public string? DescricaoEntrega { get; set; }
    public string? NomePickUp { get; set; }
    public string? NumeroPickUp { get; set; }
    public string? NomeDelivery { get; set; }
    public string? NumeroDelivery { get; set; }

    // For Vigilancia

    public string? NomeVigilancia { get; set; }
    public string? NumeroVigilancia { get; set; }

    public TarefaDTO(string id, string percurso, string estado, string emailRequisitor, 
                        string nomeContactoVigilancia, string numeroContactoVigilancia) {
        this.TipoTarefa = "Vigilancia";
        this.Id = id;
        this.PercursoString = percurso;
        this.EstadoString = estado;
        this.EmailRequisitor = emailRequisitor;
        this.NomeVigilancia = nomeContactoVigilancia;
        this.NumeroVigilancia = numeroContactoVigilancia;
    }

    public TarefaDTO(string id, string percurso, string estado, string emailRequisitor,
                        string codConfirmacao, string descricaoEntrega, 
                        string nomeContactopickup, string numeroContactopickup, 
                        string nomeContactoDelivery, string numeroContactoDelivery ) {
        this.TipoTarefa = "PickUpDelivery";
        this.Id = id;
        this.EstadoString = estado;
        this.PercursoString = percurso;
        this.EmailRequisitor = emailRequisitor;
        this.CodConfirmacao = codConfirmacao;
        this.DescricaoEntrega = descricaoEntrega;
        this.NomePickUp = nomeContactopickup;
        this.NumeroPickUp = numeroContactopickup;
        this.NomeDelivery = nomeContactoDelivery;
        this.NumeroDelivery = numeroContactoDelivery;
    }
}