using MDTarefas.Models.exceptions;
using MDTarefas.utils;
using MongoDB.Bson.Serialization.Attributes;

namespace MDTarefas.Models.tarefa.ValueObjects
{
    public class EmailRequisitor {
        private string EmailString = null!;

        public EmailRequisitor(string email) {
            if (StringValidations.isNullOrEmpty(email)) {
                throw new BusinessRuleValidationException("EmailString não pode ser nulo ou vazio");
            }
            this.EmailString = email;
        }

        public string getEmailRequisitorString() {
            return this.EmailString;
        }
    }
}