using MDTarefas.dto;
using MDTarefas.Models.tarefa;

namespace MDTarefas.mappers 
{
    public class TarefaMapper {
        public static TarefaDTO toDTO(Tarefa tarefa) {

            if (tarefa is Vigilancia) {
                Vigilancia vigilancia = (Vigilancia) tarefa;

                return new TarefaDTO(vigilancia.Id, vigilancia.Percurso.PercursoString, vigilancia.Estado.EstadoString, vigilancia.EmailRequisitor.Email,
                                    vigilancia.Contacto.Nome.NomeString, vigilancia.Contacto.NumeroTelefone.NumeroTelefoneString);
            
            } else {
               
                PickUpDelivery pickUpDelivery = (PickUpDelivery) tarefa;
                
                return new TarefaDTO(pickUpDelivery.Id, pickUpDelivery.Percurso.PercursoString, pickUpDelivery.Estado.EstadoString, pickUpDelivery.EmailRequisitor.Email,
                        pickUpDelivery.CodConfirmacao.Codigo, pickUpDelivery.DescricaoEntrega.DescricaoEntregaString, 
                        pickUpDelivery.ContactoPickUp.Nome.NomeString, pickUpDelivery.ContactoPickUp.NumeroTelefone.NumeroTelefoneString, 
                        pickUpDelivery.ContactoDelivery.Nome.NomeString, pickUpDelivery.ContactoDelivery.NumeroTelefone.NumeroTelefoneString);
            
            }
        }        
    }
}