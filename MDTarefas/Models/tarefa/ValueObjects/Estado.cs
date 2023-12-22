using MongoDB.Bson.Serialization.Attributes;
using MDTarefas.Models.exceptions;

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

        public Estado(string estadoString) {
            if (estadoString.ToLower() == "pendente") {
                this.EstadoString = EstadoEnum.Pendente;
            } else if (estadoString.ToLower() == "aceite") {
                this.EstadoString = EstadoEnum.Aceite;
            } else if (estadoString.ToLower() == "rejeitada") {
                this.EstadoString = EstadoEnum.Rejeitada;
            } else {
                throw new BusinessRuleValidationException("Estado inválido");
            }
        }

        public string getEstadoString() {
            return this.EstadoString.ToString();
        }
    }
}