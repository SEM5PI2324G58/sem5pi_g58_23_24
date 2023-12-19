using MongoDB.Bson.Serialization.Attributes;

namespace MDTarefas.Models.tarefa.ValueObjects
{
    public enum EstadoEnum
    {
        Pendente,
        Aceite,
        Rejeitada
    }
    public class Estado {

        [BsonElement("Estado")]
        public EstadoEnum EstadoString { get; private set; }

        public Estado(EstadoEnum estadoEnum) {
            this.EstadoString = estadoEnum;
        }
    }
}