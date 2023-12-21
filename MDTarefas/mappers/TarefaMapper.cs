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
                                    vigilancia.getCodDispositivo(),
                                    vigilancia.getNumeroPisoInt(),
                                    vigilancia.getCodEdificioString(),
                                    vigilancia.getContactoNomeString(),
                                    vigilancia.getContactoNumeroString());
            } else {
               
                PickUpDelivery pickUpDelivery = (PickUpDelivery) tarefa;

                return new TarefaDTO(pickUpDelivery.getId(), 
                                    pickUpDelivery.getPercursoString(),
                                    pickUpDelivery.getEstadoString(), 
                                    pickUpDelivery.getEmailRequisitorString(),
                                    pickUpDelivery.getCodDispositivo(),
                                    pickUpDelivery.getCodConfirmacaoString(), 
                                    pickUpDelivery.getDescricaoEntregaString(), 
                                    pickUpDelivery.getNomeContactoPickUpString(), 
                                    pickUpDelivery.getNumeroContactoPickUpString(), 
                                    pickUpDelivery.getNomeContactoDeliveryString(), 
                                    pickUpDelivery.getNumeroContactoDeliveryString(),
                                    pickUpDelivery.getNomeSalaInicialString(),
                                    pickUpDelivery.getNomeSalaFinalString());
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
                                    vigilancia.getCodDispositivo(),
                                    vigilancia.getContactoNomeString(),
                                    vigilancia.getContactoNumeroString(),
                                    vigilancia.getCodEdificioString(),
                                    vigilancia.getNumeroPisoInt());
            } else {
               
                PickUpDelivery pickUpDelivery = (PickUpDelivery) tarefa;

                return new TarefaSchema(pickUpDelivery.getId(), 
                                    pickUpDelivery.getPercursoString(),
                                    pickUpDelivery.getEstadoString(), 
                                    pickUpDelivery.getEmailRequisitorString(),
                                    pickUpDelivery.getCodDispositivo(),
                                    pickUpDelivery.getCodConfirmacaoString(), 
                                    pickUpDelivery.getDescricaoEntregaString(), 
                                    pickUpDelivery.getNomeContactoPickUpString(), 
                                    pickUpDelivery.getNumeroContactoPickUpString(), 
                                    pickUpDelivery.getNomeContactoDeliveryString(), 
                                    pickUpDelivery.getNumeroContactoDeliveryString(),
                                    pickUpDelivery.getNomeSalaInicialString(),
                                    pickUpDelivery.getNomeSalaFinalString());
            }
        }     

        public static Tarefa toDomain(TarefaSchema tarefaSchema) {

            if (tarefaSchema.TipoTarefa.Equals("Vigilancia") 
                && tarefaSchema.NomeVigilancia != null && tarefaSchema.NumeroVigilancia != null
                && tarefaSchema.CodEdificio != null && tarefaSchema.NumeroPiso != null && tarefaSchema.CodDispositivo != null) {

                return new Vigilancia(tarefaSchema.NomeVigilancia, 
                                    tarefaSchema.NumeroVigilancia,
                                    tarefaSchema.CodEdificio,
                                    tarefaSchema.NumeroPiso ?? 0, 
                                    tarefaSchema.PercursoString, 
                                    tarefaSchema.EmailRequisitor, 
                                    tarefaSchema.Id,
                                    tarefaSchema.CodDispositivo);

            } else if (tarefaSchema.TipoTarefa.Equals("PickUpDelivery") 
                        && tarefaSchema.CodConfirmacao != null && tarefaSchema.DescricaoEntrega != null
                        && tarefaSchema.NomePickUp != null && tarefaSchema.NumeroPickUp != null
                        && tarefaSchema.NomeDelivery != null && tarefaSchema.NumeroDelivery != null 
                        && tarefaSchema.SalaInicial != null && tarefaSchema.SalaFinal != null && tarefaSchema.CodDispositivo != null){
               
                return new PickUpDelivery(tarefaSchema.CodConfirmacao, 
                                    tarefaSchema.DescricaoEntrega,
                                    tarefaSchema.NumeroPickUp, 
                                    tarefaSchema.NomePickUp, 
                                    tarefaSchema.NumeroDelivery, 
                                    tarefaSchema.NomeDelivery,
                                    tarefaSchema.SalaInicial,
                                    tarefaSchema.SalaFinal,
                                    tarefaSchema.PercursoString,
                                    tarefaSchema.EmailRequisitor,
                                    tarefaSchema.Id,
                                    tarefaSchema.CodDispositivo);
            }

            throw new ArgumentException("Invalid TarefaSchema");
        }
    }
}