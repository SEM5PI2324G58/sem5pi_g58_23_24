using MongoDB.Bson.Serialization.Attributes;

namespace MDTarefas.Models.tarefa.ValueObjects
{
    public class Percurso {
        [BsonElement("Percurso")]
        public string PercursoString { get; private set;} = null!;

        public Percurso(string percursoString) {
            this.PercursoString = percursoString;
        }
    }
}