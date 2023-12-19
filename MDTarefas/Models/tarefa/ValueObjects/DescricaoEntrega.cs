using MDTarefas.Models.exceptions;
using MDTarefas.utils;

namespace MDTarefas.Models.tarefa.ValueObjects{
    public class DescricaoEntrega {
        public string DescricaoEntregaString { get; private set;} = null!;

        public DescricaoEntrega(string descricaoEntregaString) {
            if (StringValidations.isNullOrEmpty(descricaoEntregaString) || 
                !StringValidations.isAlphanumericOrWhiteSpace(descricaoEntregaString) || 
                !StringValidations.hasLengthLessOrEqualTo(descricaoEntregaString, 1000) ) {
                throw new BusinessRuleValidationException("Descrição de entrega deve ter apenas caracteres alfuanuméricos e espaços, ter no máximo 1000 caracteres e não pode ser vazia");
            }
            this.DescricaoEntregaString = descricaoEntregaString;
        }
    }
}