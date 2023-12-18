using MongoDB.Bson.Serialization.Attributes;

namespace MDTarefas.Models.tarefa.ValueObjects
{
    public class EmailRequisitor {
        [BsonElement("EmailRequisitor")]
        public string Email { get; private set; } = null!;

        public EmailRequisitor(string email) {
            this.Email = email;
        }
    }
}