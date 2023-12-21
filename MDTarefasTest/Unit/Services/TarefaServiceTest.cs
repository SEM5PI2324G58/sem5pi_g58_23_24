using System.Net;
using System.Net.Http;
using Moq.Protected;

namespace MDTarefasTest.Services;

public class TarefaServiceTest {

    [Fact]
    public async void ensureInvalidTipoTarefaThrowsException() {
        var tarefaRepo = new Mock<ITarefaRepo>();
        var tarefaService = new TarefaService(tarefaRepo.Object, new HttpClient());

        var criarTarefaDTO = new CriarTarefaDTO();
        criarTarefaDTO.TipoTarefa = "invalido";

        async Task ActAsync() => await tarefaService.criarTarefa(criarTarefaDTO);

        var exception = await Assert.ThrowsAsync<BusinessRuleValidationException>(ActAsync);

        Assert.Equal("Tipo de tarefa inválido", exception.Message);
    }


    [Fact]
    public async void ensureMissingVigilanciaParametersThrowsException() {
        var tarefaRepo = new Mock<ITarefaRepo>();
        var tarefaService = new TarefaService(tarefaRepo.Object, new HttpClient());

        var criarTarefaDTO = new CriarTarefaDTO();
        criarTarefaDTO.TipoTarefa = "vigilancia";

        async Task ActAsync() => await tarefaService.criarTarefa(criarTarefaDTO);

        var exception = await Assert.ThrowsAsync<BusinessRuleValidationException>(ActAsync);

        Assert.Equal("Tarefa de vigilância necessita de um contacto (nome e nº de telefone), código de edifício e número de piso", exception.Message);
    }
    [Fact]
    public async void ensureMissingPickUpDeliveryParametersThrowsException() {
        var tarefaRepo = new Mock<ITarefaRepo>();
        var tarefaService = new TarefaService(tarefaRepo.Object, new HttpClient());

        var criarTarefaDTO = new CriarTarefaDTO();
        criarTarefaDTO.TipoTarefa = "PICkUPDELIVERY";

        async Task ActAsync() => await tarefaService.criarTarefa(criarTarefaDTO);

        var exception = await Assert.ThrowsAsync<BusinessRuleValidationException>(ActAsync);

        Assert.Equal("Tarefa de pick up and delivery necessita de um código de confirmação, descrição de entrega, contactos (nome e nº de telefone) de pick up e delivery, sala inicial e sala final", exception.Message);
    }

    [Fact]
    public async void ensureValidPickUpDeliveryIsCreated() {

        var expectedTarefa = new PickUpDelivery(
            "12345","DESC",
            "123456789","NOMEPCIKUP",
            "987654321","NOMEDELIVERY",
            "A201","A202",
            "[cel(a1,1,1),cel(a1,2,2)]","emailplaceholder","id",""
        );    

        // To mock the http request, we need to mock the HttpMessageHandler (Client calls MessageHandler)
        var httpHandlerMock = new Mock<HttpMessageHandler>();
        
        var httpResponse = new HttpResponseMessage
                             {
                                 StatusCode = HttpStatusCode.OK,
                                 Content = new StringContent("[cel(a1,1,1),cel(a1,2,2)]")
                             };


        httpHandlerMock.Protected()
                .Setup<Task<HttpResponseMessage>>(
                "SendAsync",
                ItExpr.IsAny<HttpRequestMessage>(),
                ItExpr.IsAny<CancellationToken>())
                .ReturnsAsync(httpResponse);
        
        var httpClient = new HttpClient(httpHandlerMock.Object);

        // Mock the repository
        var tarefaRepoMock = new Mock<ITarefaRepo>();
        
        tarefaRepoMock.Setup(repo => repo.CreateAsync(It.IsAny<Tarefa>()))
            .ReturnsAsync((Tarefa tarefa) => tarefa);        
        

        // Create the service
        var tarefaService = new TarefaService(tarefaRepoMock.Object, httpClient);

        // Params
        CriarTarefaDTO criarTarefaDTO = new CriarTarefaDTO();
        criarTarefaDTO.TipoTarefa = "PICkUPDELIVERY";
        criarTarefaDTO.CodConfirmacao = "12345";
        criarTarefaDTO.DescricaoEntrega = "DESC";
        criarTarefaDTO.NomePickUp = "NOMEPCIKUP";
        criarTarefaDTO.NumeroPickUp = "123456789";
        criarTarefaDTO.NomeDelivery = "NOMEDELIVERY";
        criarTarefaDTO.NumeroDelivery = "987654321";
        criarTarefaDTO.SalaInicial = "A201";
        criarTarefaDTO.SalaFinal = "A202";


        var res = await tarefaService.criarTarefa(criarTarefaDTO);

        Assert.Equal(expectedTarefa.getCodConfirmacaoString(), res.CodConfirmacao);
        Assert.Equal(expectedTarefa.getDescricaoEntregaString(), res.DescricaoEntrega);
        Assert.Equal(expectedTarefa.getNomeContactoPickUpString(), res.NomePickUp);
        Assert.Equal(expectedTarefa.getNumeroContactoPickUpString(), res.NumeroPickUp);
        Assert.Equal(expectedTarefa.getNomeContactoDeliveryString(), res.NomeDelivery);
        Assert.Equal(expectedTarefa.getNumeroContactoDeliveryString(), res.NumeroDelivery);
        Assert.Equal(expectedTarefa.getNomeSalaInicialString(), res.SalaInicial);
        Assert.Equal(expectedTarefa.getNomeSalaFinalString(), res.SalaFinal);
    }
}