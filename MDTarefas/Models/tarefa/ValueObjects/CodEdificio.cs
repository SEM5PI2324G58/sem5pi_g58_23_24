using MDTarefas.Models.exceptions;
using MDTarefas.utils;

namespace MDTarefas.Models.tarefa.ValueObjects
{
    public class CodEdificio
    {
        private string CodEdificioString = null!;

        public CodEdificio(string codEdificio)
        {
            if (StringValidations.isNullOrEmpty(codEdificio))
            {
                throw new BusinessRuleValidationException("Código do edifício não pode ser nulo ou vazio");
            }

            this.CodEdificioString = codEdificio;
        }

        public string getCodEdificioString()
        {
            return this.CodEdificioString;
        }

    }
}