using MDTarefas.Models.exceptions;
using MDTarefas.utils;
using MongoDB.Bson.Serialization.Attributes;

namespace MDTarefas.Models.tarefa.ValueObjects{
    public class NumeroTelefone {
        [BsonElement("NumeroString")]
        public string NumeroTelefoneString { get; private set; } = null!;

        public NumeroTelefone(string numeroTelefoneString) {
            if ( StringValidations.isNullOrEmpty(numeroTelefoneString) ||
                !StringValidations.isNumeric(numeroTelefoneString) || 
                numeroTelefoneString.Length != 9) {
                throw new BusinessRuleValidationException("Número de telefone deve ser um número com 9 dígitos");
            }
            this.NumeroTelefoneString = numeroTelefoneString;
        }
    }
}


