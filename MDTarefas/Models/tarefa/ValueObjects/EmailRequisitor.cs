using MDTarefas.Models.exceptions;
using MDTarefas.utils;
using MongoDB.Bson.Serialization.Attributes;

namespace MDTarefas.Models.tarefa.ValueObjects
{
    public class EmailRequisitor {
        [BsonElement("EmailRequisitor")]
        public string Email { get; private set; } = null!;

        public EmailRequisitor(string email) {
            if (!StringValidations.isNullOrEmpty(email)) {
                throw new BusinessRuleValidationException("Email não pode ser nulo ou vazio");
            }
            this.Email = email;
        }
    }
}