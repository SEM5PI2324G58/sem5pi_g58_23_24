using MDTarefas.Models.exceptions;
using MDTarefas.utils;
using MongoDB.Bson.Serialization.Attributes;

namespace MDTarefas.Models.tarefa.ValueObjects
{
    public class Percurso {
        private string PercursoString = null!;

        public Percurso(string percursoString) {
            if (StringValidations.isNullOrEmpty(percursoString)) {
                throw new BusinessRuleValidationException("Percurso não pode ser nulo ou vazio");
            }
            this.PercursoString = percursoString;
        }

        public string getPercursoString() {
            return this.PercursoString;
        }
    }
}