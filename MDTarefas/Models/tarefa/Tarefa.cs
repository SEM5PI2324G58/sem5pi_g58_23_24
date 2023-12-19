using MDTarefas.Models.tarefa.ValueObjects;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace MDTarefas.Models.tarefa
{
    [BsonKnownTypes(typeof(PickUpDelivery), typeof(Vigilancia))]
    public abstract class Tarefa
    {
        
        private string Id;
        private Estado Estado = null!;

        private Percurso Percurso = null!;
        
        private EmailRequisitor EmailRequisitor = null!;

        public Tarefa(string id, string percurso, string emailRequisitor) {
            this.Id = id;
            this.Estado = new Estado(EstadoEnum.Pendente);
            this.Percurso = new Percurso(percurso);
            this.EmailRequisitor = new EmailRequisitor(emailRequisitor);
        }

        public void updateId(string id) {
            this.Id = id;
        }

        public string getId() {
            return this.Id;
        }

        public string getEstadoString() {
            return this.Estado.getEstadoString();
        }

        public string getPercursoString() {
            return this.Percurso.getPercursoString();
        }

        public string getEmailRequisitorString() {
            return this.EmailRequisitor.getEmailRequisitorString();
        }
    }
}