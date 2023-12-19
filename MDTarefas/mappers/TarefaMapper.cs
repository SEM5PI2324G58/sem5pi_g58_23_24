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

        public static Tarefa toDomain(TarefaSchema tarefaSchema) {

            if (tarefaSchema.TipoTarefa.Equals("Vigilancia") 
                && tarefaSchema.NomeVigilancia != null && tarefaSchema.NumeroVigilancia != null) {

                return new Vigilancia(tarefaSchema.NomeVigilancia, 
                                    tarefaSchema.NumeroVigilancia, 
                                    tarefaSchema.PercursoString, 
                                    tarefaSchema.EmailRequisitor, 
                                    tarefaSchema.Id);
            } else if (tarefaSchema.TipoTarefa.Equals("PickUpDelivery") 
                        && tarefaSchema.CodConfirmacao != null && tarefaSchema.DescricaoEntrega != null
                        && tarefaSchema.NomePickUp != null && tarefaSchema.NumeroPickUp != null
                        && tarefaSchema.NomeDelivery != null && tarefaSchema.NumeroDelivery != null){
               
                return new PickUpDelivery(tarefaSchema.CodConfirmacao, 
                                    tarefaSchema.DescricaoEntrega,
                                    tarefaSchema.NumeroPickUp, 
                                    tarefaSchema.NomePickUp, 
                                    tarefaSchema.NumeroDelivery, 
                                    tarefaSchema.NomeDelivery,
                                    tarefaSchema.PercursoString,
                                    tarefaSchema.EmailRequisitor,
                                    tarefaSchema.Id);
            }

            throw new ArgumentException("Invalid TarefaSchema");
        }
    }
}