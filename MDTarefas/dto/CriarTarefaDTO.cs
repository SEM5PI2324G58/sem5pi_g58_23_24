namespace MDTarefas.dto;

public class CriarTarefaDTO
{
    public string TipoTarefa { get; set; } = null!; // "PickUpDelivery" or "Vigilancia"
    // For both types of Tarefa
    
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

}