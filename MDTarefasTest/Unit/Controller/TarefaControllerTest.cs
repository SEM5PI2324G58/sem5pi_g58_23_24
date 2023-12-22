namespace MDTarefasTest.Unit.Controller
{
    public class TarefaControllerTest
    {
        [Fact]
        public async void ensureInvalidParametersReturnsBadRequest()
        {
            var serviceMock = new Mock<ITarefaService>();
            var errorMessage = "Tipo de tarefa inválido";
            serviceMock.Setup(service => service.criarTarefa(It.IsAny<CriarTarefaDTO>()))
                .ThrowsAsync(new BusinessRuleValidationException(errorMessage));

            var controller = new TarefaController(serviceMock.Object);

            CriarTarefaDTO criarTarefaDTO = new CriarTarefaDTO();
            criarTarefaDTO.TipoTarefa = "FAIL";

            var res = await controller.Create(criarTarefaDTO);

            var badRequestResult = Assert.IsType<BadRequestObjectResult>(res.Result);
            Assert.Equal(errorMessage, badRequestResult.Value);

        }

        [Fact]
        public async void ensureValidParametersReturnsCreated()
        {
            var serviceMock = new Mock<ITarefaService>();

            TarefaDTO returnTarefaDTO = new TarefaDTO();
            returnTarefaDTO.Id = "id";
            returnTarefaDTO.TipoTarefa = "PickUpDelivery";
            returnTarefaDTO.CodConfirmacao = "12345";
            returnTarefaDTO.DescricaoEntrega = "DESC";
            returnTarefaDTO.NomePickUp = "NOMEPCIKUP";
            returnTarefaDTO.NumeroPickUp = "123456789";
            returnTarefaDTO.NomeDelivery = "NOMEDELIVERY";
            returnTarefaDTO.NumeroDelivery = "987654321";
            returnTarefaDTO.SalaInicial = "A201";
            returnTarefaDTO.SalaFinal = "A202";

            serviceMock.Setup(service => service.criarTarefa(It.IsAny<CriarTarefaDTO>()))
                .ReturnsAsync(returnTarefaDTO);

            var controller = new TarefaController(serviceMock.Object);


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

            var res = await controller.Create(criarTarefaDTO);

            var requestResult = Assert.IsType<CreatedResult>(res.Result);
            
            Assert.Equal(requestResult.Value, returnTarefaDTO);

        }

        [Fact]
        public async void ControllerServiceValidParametersReturnsCreated()
        {
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

            

            var controller = new TarefaController(tarefaService);

            var res = await controller.Create(criarTarefaDTO);

            var requestResult = Assert.IsType<CreatedResult>(res.Result);
            
            var dtoRes = Assert.IsType<TarefaDTO>(requestResult.Value);
            Assert.Equal("PickUpDelivery", dtoRes.TipoTarefa);
            Assert.Equal("12345", dtoRes.CodConfirmacao);
            Assert.Equal("DESC", dtoRes.DescricaoEntrega);
            Assert.Equal("NOMEPCIKUP", dtoRes.NomePickUp);
            Assert.Equal("123456789", dtoRes.NumeroPickUp);
            Assert.Equal("NOMEDELIVERY", dtoRes.NomeDelivery);
            Assert.Equal("987654321", dtoRes.NumeroDelivery);
            Assert.Equal("A201", dtoRes.SalaInicial);
            Assert.Equal("A202", dtoRes.SalaFinal);
        }

        
        [Fact]
        public async void listarTarefasPendentesDevolveNotFoundCasoNaoExistamTarefas(){
            var serviceMock = new Mock<ITarefaService>();
            serviceMock.Setup(service => service.listarTarefasPendentes())
                .ReturnsAsync(new List<TarefaDTO>());

            var controller = new TarefaController(serviceMock.Object);

            var res = await controller.GetTarefasPendentes();

            var notFoundResult = Assert.IsType<NotFoundObjectResult>(res.Result);
            Assert.Equal(404, notFoundResult.StatusCode);
            Assert.Equal("Não existem tarefas pendentes", notFoundResult.Value);
        }

        [Fact]
        public async void listarTarefasPendentesDevolveTarefasPendentes(){
            var serviceMock = new Mock<ITarefaService>();

            TarefaDTO tarefaDTO = new TarefaDTO();
            tarefaDTO.Id = "id";
            tarefaDTO.TipoTarefa = "PickUpDelivery";
            tarefaDTO.CodConfirmacao = "12345";
            tarefaDTO.DescricaoEntrega = "DESC";
            tarefaDTO.NomePickUp = "NOMEPCIKUP";
            tarefaDTO.NumeroPickUp = "123456789";
            tarefaDTO.NomeDelivery = "NOMEDELIVERY";
            tarefaDTO.NumeroDelivery = "987654321";
            tarefaDTO.SalaInicial = "A201";
            tarefaDTO.SalaFinal = "A202";
            tarefaDTO.PercursoString = "[cel(a1,1,1),cel(a1,2,2)]";


            serviceMock.Setup(service => service.listarTarefasPendentes())
                .ReturnsAsync(new List<TarefaDTO>(){tarefaDTO});

            var controller = new TarefaController(serviceMock.Object);

            var res = await controller.GetTarefasPendentes();

            var okResult = Assert.IsType<OkObjectResult>(res.Result);
            Assert.Equal(200, okResult.StatusCode);
            Assert.Equal(new List<TarefaDTO>(){tarefaDTO}, okResult.Value);
        }

        [Fact]
        public async void controllerServiceListarTarefasPendentesDevolveTarefasPendentes(){
            var tarefaRepoMock = new Mock<ITarefaRepo>();
            var httpClient = new HttpClient();

            Tarefa tarefa = new PickUpDelivery(
                "12345","DESC",
                "123456789","NOMEPCIKUP",
                "987654321","NOMEDELIVERY",
                "A201","A202",
                "[cel(a1,1,1),cel(a1,2,2)]","emailplaceholder","id",""
            );

            TarefaDTO tarefaDTO = new TarefaDTO();
            tarefaDTO.Id = "id";
            tarefaDTO.TipoTarefa = "PickUpDelivery";
            tarefaDTO.CodConfirmacao = "12345";
            tarefaDTO.DescricaoEntrega = "DESC";
            tarefaDTO.NomePickUp = "NOMEPCIKUP";
            tarefaDTO.NumeroPickUp = "123456789";
            tarefaDTO.NomeDelivery = "NOMEDELIVERY";
            tarefaDTO.NumeroDelivery = "987654321";
            tarefaDTO.SalaInicial = "A201";
            tarefaDTO.SalaFinal = "A202";
            tarefaDTO.PercursoString = "[cel(a1,1,1),cel(a1,2,2)]";


            tarefaRepoMock.Setup(repo => repo.GetTarefasPendentesAsync())
                .ReturnsAsync(new List<Tarefa>(){tarefa});

            var tarefaService = new TarefaService(tarefaRepoMock.Object, httpClient);

            var controller = new TarefaController(tarefaService);

            var res = await controller.GetTarefasPendentes();

            var okResult = Assert.IsType<OkObjectResult>(res.Result);
            Assert.Equal(200, okResult.StatusCode);
            var dtoRes = Assert.IsType<List<TarefaDTO>>(okResult.Value);

            Assert.Equal(tarefaDTO.Id, dtoRes[0].Id);
            Assert.Equal(tarefaDTO.TipoTarefa, dtoRes[0].TipoTarefa);
            Assert.Equal(tarefaDTO.CodConfirmacao, dtoRes[0].CodConfirmacao);
            Assert.Equal(tarefaDTO.DescricaoEntrega, dtoRes[0].DescricaoEntrega);
            Assert.Equal(tarefaDTO.NomePickUp, dtoRes[0].NomePickUp);
            Assert.Equal(tarefaDTO.NumeroPickUp, dtoRes[0].NumeroPickUp);
            Assert.Equal(tarefaDTO.NomeDelivery, dtoRes[0].NomeDelivery);
            Assert.Equal(tarefaDTO.NumeroDelivery, dtoRes[0].NumeroDelivery);
            Assert.Equal(tarefaDTO.SalaInicial, dtoRes[0].SalaInicial);
            Assert.Equal(tarefaDTO.SalaFinal, dtoRes[0].SalaFinal);
            Assert.Equal(tarefaDTO.PercursoString, dtoRes[0].PercursoString);

        }

    }
}