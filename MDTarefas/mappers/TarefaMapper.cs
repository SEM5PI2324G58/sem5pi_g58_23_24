using MDTarefas.dataSchemas;
using MDTarefas.dto;
using MDTarefas.Models.tarefa;

namespace MDTarefas.mappers 
{
    public class TarefaMapper {

        //DTOs
        public static TarefaDTO toDTO(Tarefa tarefa) {

            if (tarefa is Vigilancia) {

                Vigilancia vigilancia = (Vigilancia) tarefa;

                return new TarefaDTO(vigilancia.getId(), 
                                    vigilancia.getPercursoString(), 
                                    vigilancia.getEstadoString(),
                                    vigilancia.getEmailRequisitorString(),
                                    vigilancia.getContactoNomeString(),
                                    vigilancia.getContactoNumeroString());
            } else {
               
                PickUpDelivery pickUpDelivery = (PickUpDelivery) tarefa;

                return new TarefaDTO(pickUpDelivery.getId(), 
                                    pickUpDelivery.getPercursoString(),
                                    pickUpDelivery.getEstadoString(), 
                                    pickUpDelivery.getEmailRequisitorString(),
                                    pickUpDelivery.getCodConfirmacaoString(), 
                                    pickUpDelivery.getDescricaoEntregaString(), 
                                    pickUpDelivery.getNomeContactoickUpString(), 
                                    pickUpDelivery.getNumeroContactoPickUpString(), 
                                    pickUpDelivery.getNomeContactoDeliveryString(), 
                                    pickUpDelivery.getNumeroContactoDeliveryString());
            }
        }   

        //SCHEMAS

        public static TarefaSchema toPersistance(Tarefa tarefa) {

            if (tarefa is Vigilancia) {

                Vigilancia vigilancia = (Vigilancia) tarefa;

                return new TarefaSchema(vigilancia.getId(), 
                                    vigilancia.getPercursoString(), 
                                    vigilancia.getEstadoString(),
                                    vigilancia.getEmailRequisitorString(),
                                    vigilancia.getContactoNomeString(),
                                    vigilancia.getContactoNumeroString());
            } else {
               
                PickUpDelivery pickUpDelivery = (PickUpDelivery) tarefa;

                return new TarefaSchema(pickUpDelivery.getId(), 
                                    pickUpDelivery.getPercursoString(),
                                    pickUpDelivery.getEstadoString(), 
                                    pickUpDelivery.getEmailRequisitorString(),
                                    pickUpDelivery.getCodConfirmacaoString(), 
                                    pickUpDelivery.getDescricaoEntregaString(), 
                                    pickUpDelivery.getNomeContactoickUpString(), 
                                    pickUpDelivery.getNumeroContactoPickUpString(), 
                                    pickUpDelivery.getNomeContactoDeliveryString(), 
                                    pickUpDelivery.getNumeroContactoDeliveryString());
            }
        }     
    }
}