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
        private EstadoEnum EstadoString;
        public Estado(EstadoEnum estadoEnum) {
            this.EstadoString = estadoEnum;
        }

        public string getEstadoString() {
            return this.EstadoString.ToString();
        }
    }
}