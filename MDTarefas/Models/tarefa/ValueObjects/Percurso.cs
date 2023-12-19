using MDTarefas.Models.exceptions;
using MDTarefas.utils;
using MongoDB.Bson.Serialization.Attributes;

namespace MDTarefas.Models.tarefa.ValueObjects
{
    public class Percurso {
        [BsonElement("Percurso")]
        public string PercursoString { get; private set;} = null!;

        public Percurso(string percursoString) {
            if (StringValidations.isNullOrEmpty(percursoString)) {
                throw new BusinessRuleValidationException("Percurso não pode ser nulo ou vazio");
            }
            this.PercursoString = percursoString;
        }
    }
}