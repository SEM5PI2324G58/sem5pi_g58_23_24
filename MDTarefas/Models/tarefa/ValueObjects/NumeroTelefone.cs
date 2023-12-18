using MongoDB.Bson.Serialization.Attributes;

namespace MDTarefas.Models.tarefa.ValueObjects{
    public class NumeroTelefone {
        [BsonElement("NumeroString")]
        public string NumeroTelefoneString { get; private set; } = null!;

        public NumeroTelefone(string numeroTelefoneString) {
            this.NumeroTelefoneString = numeroTelefoneString;
        }
    }
}


