

namespace MDTarefasTest.Services;

public class TarefaServiceTest {

    [Fact]
    public async void ensureInvalidTipoTarefaThrowsException() {
        var tarefaRepo = new Mock<ITarefaRepo>();
        var tarefaService = new TarefaService(tarefaRepo.Object);

        var criarTarefaDTO = new CriarTarefaDTO();
        criarTarefaDTO.TipoTarefa = "invalido";

        async Task ActAsync() => await tarefaService.criarTarefa(criarTarefaDTO);

        var exception = await Assert.ThrowsAsync<BusinessRuleValidationException>(ActAsync);

        Assert.Equal("Tipo de tarefa inválido", exception.Message);
    }


    [Fact]
    public async void ensureMissingVigilanciaParametersThrowsException() {
        var tarefaRepo = new Mock<ITarefaRepo>();
        var tarefaService = new TarefaService(tarefaRepo.Object);

        var criarTarefaDTO = new CriarTarefaDTO();
        criarTarefaDTO.TipoTarefa = "vigilancia";

        async Task ActAsync() => await tarefaService.criarTarefa(criarTarefaDTO);

        var exception = await Assert.ThrowsAsync<BusinessRuleValidationException>(ActAsync);

        Assert.Equal("Tarefa de vigilância necessita de um contacto (nome e nº de telefone), código de edifício e número de piso", exception.Message);
    }
    [Fact]
    public async void ensureMissingPickUpDeliveryParametersThrowsException() {
        var tarefaRepo = new Mock<ITarefaRepo>();
        var tarefaService = new TarefaService(tarefaRepo.Object);

        var criarTarefaDTO = new CriarTarefaDTO();
        criarTarefaDTO.TipoTarefa = "PICkUPDELIVERY";

        async Task ActAsync() => await tarefaService.criarTarefa(criarTarefaDTO);

        var exception = await Assert.ThrowsAsync<BusinessRuleValidationException>(ActAsync);

        Assert.Equal("Tarefa de pick up and delivery necessita de um código de confirmação, descrição de entrega, contactos (nome e nº de telefone) de pick up e delivery, sala inicial e sala final", exception.Message);
    }
}