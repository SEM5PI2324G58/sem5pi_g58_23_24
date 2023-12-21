using MDTarefas.Models.exceptions;
using MDTarefas.utils;

namespace MDTarefas.Models.tarefa.ValueObjects{

    public class NomeSala{
        private string NomeSalaString = null!;

        public NomeSala(string nomeSala) {
            if(StringValidations.isNullOrEmpty(nomeSala)) {
                throw new BusinessRuleValidationException("Nome da sala não pode ser nulo ou vazio");
            }
            this.NomeSalaString = nomeSala;
        }

        public string getNomeSalaString() {
            return this.NomeSalaString;
        }
    }

}