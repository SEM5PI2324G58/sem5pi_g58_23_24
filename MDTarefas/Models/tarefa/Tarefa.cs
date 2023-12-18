using MDTarefas.Models.tarefa.ValueObjects;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace MDTarefas.Models.tarefa
{
    [BsonKnownTypes(typeof(PickUpDelivery), typeof(Vigilancia))]
    public abstract class Tarefa
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; private set;}
        public Estado Estado { get; private set; } = null!;

        public Percurso Percurso { get; private set;} = null!;
        
        public EmailRequisitor EmailRequisitor { get; private set; } = null!;

        public Tarefa(string id, string percurso, string emailRequisitor) {
            this.Id = id;
            this.Estado = new Estado(EstadoEnum.Pendente);
            this.Percurso = new Percurso(percurso);
            this.EmailRequisitor = new EmailRequisitor(emailRequisitor);
        }

        public void updateId(string id) {
            this.Id = id;
        }
    }
}