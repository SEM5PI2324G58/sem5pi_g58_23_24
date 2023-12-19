using MDTarefas.Models.exceptions;
using MDTarefas.utils;
using MongoDB.Bson.Serialization.Attributes;

namespace MDTarefas.Models.tarefa.ValueObjects{

    public class Nome {
        [BsonElement("NomeString")]
        private string NomeString = null!;

        public Nome(string nomeString) {
            if (StringValidations.isNullOrEmpty(nomeString)) {
                throw new BusinessRuleValidationException("Nome não pode ser nulo ou vazio");
            }
            this.NomeString = nomeString;
        }

        public string getNomeString() {
            return this.NomeString;
        }
    }
    
}
