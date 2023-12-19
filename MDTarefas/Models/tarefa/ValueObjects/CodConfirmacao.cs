using MDTarefas.Models.exceptions;
using MDTarefas.utils;

namespace MDTarefas.Models.tarefa.ValueObjects
{
    public class CodConfirmacao
    {
        public string Codigo { get; private set; } = null!;

        public CodConfirmacao(string codigo) {
            if (StringValidations.isNullOrEmpty(codigo) || !StringValidations.isNumeric(codigo) || 
                !StringValidations.hasLengthBetweenOrEqualTo(codigo, 4, 6)) {
                throw new BusinessRuleValidationException("Código de confirmação deve ser um número com 4 a 6 dígitos");
            }
            this.Codigo = codigo;
        }
    }
}