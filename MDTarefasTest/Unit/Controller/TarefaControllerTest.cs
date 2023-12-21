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
    }
}