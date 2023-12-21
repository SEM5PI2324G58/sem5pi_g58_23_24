using MDTarefas.Models.tarefa.ValueObjects;


namespace MDTarefasTest.Unit
{
    public class EstadoTest
    {
        [Fact]
        public void ensureEstadoPendenteIsCorrectString()
        {
            Estado estado = new Estado(EstadoEnum.Pendente);
            Assert.Equal("Pendente", estado.getEstadoString());
        }

        [Fact]
        public void ensureEstadoAceiteIsCorrectString()
        {
            Estado estado = new Estado(EstadoEnum.Aceite);
            Assert.Equal("Aceite", estado.getEstadoString());
        }

        [Fact]
        public void ensureEstadoRejeitadaIsCorrectString()
        {
            Estado estado = new Estado(EstadoEnum.Rejeitada);
            Assert.Equal("Rejeitada", estado.getEstadoString());
        }
    }
}