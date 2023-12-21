

namespace MDTarefasTest.Services;

public class TarefaServiceTest {

    [Fact]
    public async void ensureInvalidTipoTarefaThrowsException() {
        var tarefaRepo = new Mock<TarefaRepo>();
        var tarefaService = new TarefaService(tarefaRepo.Object);

        var criarTarefaDTO = new CriarTarefaDTO();
        criarTarefaDTO.TipoTarefa = "invalido";

        async Task ActAsync() => await tarefaService.criarTarefa(criarTarefaDTO);

        var exception = await Assert.ThrowsAsync<BusinessRuleValidationException>(ActAsync);

        Assert.Equal("Tipo de tarefa inválido", exception.Message);
    }

}