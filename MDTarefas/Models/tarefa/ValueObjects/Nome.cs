using MongoDB.Bson.Serialization.Attributes;

namespace MDTarefas.Models.tarefa.ValueObjects{

    public class Nome {
        [BsonElement("NomeString")]
        public string NomeString { get; private set;} = null!;

        public Nome(string nomeString) {
            this.NomeString = nomeString;
        }
    }
    
}
