using MDTarefas.Models.exceptions;
using MongoDB.Bson.Serialization.Attributes;

namespace MDTarefas.Models.tarefa.ValueObjects{
    
    public class Contacto {
        [BsonElement("NomeContacto")]
        public Nome Nome { get; private set; } = null!;
        [BsonElement("NumeroContacto")]
        public NumeroTelefone NumeroTelefone { get; private set; } = null!;

        public Contacto(Nome nome, NumeroTelefone numeroTelefone)
        {
            if (nome == null || numeroTelefone == null) {
                throw new BusinessRuleValidationException("Nome e número de telefone não podem ser nulos");
            }
            this.Nome = nome;
            this.NumeroTelefone = numeroTelefone;
        }
    }
    
}
