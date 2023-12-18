using MongoDB.Bson.Serialization.Attributes;

namespace MDTarefas.Models.tarefa.ValueObjects
{
    public class Estado {
        [BsonElement("Estado")]
        public string EstadoString { get; private set; } = null!;

        public Estado(string estadoString) {
            this.EstadoString = estadoString;
        }
    }
}