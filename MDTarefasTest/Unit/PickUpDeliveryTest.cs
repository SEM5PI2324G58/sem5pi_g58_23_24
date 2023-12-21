using MDTarefas.Models.tarefa;

namespace MDTarefasTest.Unit
{
    public class PickUpDeliveryTest
    {
        [Fact]
        public void ensurePickUpDeliveryGetIdIsCorrect()
        {
            PickUpDelivery pickUpDelivery = new PickUpDelivery("12345", "Desc1", 
                                                                "123456789", "ABC",
                                                                "987654321", "CBA",
                                                                "[cel(a1,1,1),cel(a1,2,2)]", "email@email.pt", "id");
            Assert.Equal("id", pickUpDelivery.getId());
        }

        [Fact]
        public void ensureEstadoPickUpDeliveryIsPendingWhenCreating()
        {
           PickUpDelivery pickUpDelivery = new PickUpDelivery("12345", "Desc1", 
                                                                "123456789", "ABC",
                                                                "987654321", "CBA",
                                                                "[cel(a1,1,1),cel(a1,2,2)]", "email@email.pt", "id");
            Assert.Equal("Pendente", pickUpDelivery.getEstadoString());
        }

        [Fact]
        public void ensurePickUpDeliveryGetPercursoStringIsCorrect()
        {
            PickUpDelivery pickUpDelivery = new PickUpDelivery("12345", "Desc1", 
                                                                "123456789", "ABC",
                                                                "987654321", "CBA",
                                                                "[cel(a1,1,1),cel(a1,2,2)]", "email@email.pt", "id");
            Assert.Equal("[cel(a1,1,1),cel(a1,2,2)]", pickUpDelivery.getPercursoString());
        }

        [Fact]
        public void ensurePickUpDeliveryGetEmailRequisitorStringIsCorrect()
        {
            PickUpDelivery pickUpDelivery = new PickUpDelivery("12345", "Desc1", 
                                                                "123456789", "ABC",
                                                                "987654321", "CBA",
                                                                "[cel(a1,1,1),cel(a1,2,2)]", "email@email.pt", "id");
            Assert.Equal("email@email.pt", pickUpDelivery.getEmailRequisitorString());
        }

        [Fact]
        public void ensurePickUpDeliveryGetContactoPickUpNomeStringIsCorrect()
        {
            PickUpDelivery pickUpDelivery = new PickUpDelivery("12345", "Desc1", 
                                                                "123456789", "ABC",
                                                                "987654321", "CBA",
                                                                "[cel(a1,1,1),cel(a1,2,2)]", "email@email.pt", "id");
            Assert.Equal("ABC", pickUpDelivery.getNomeContactoPickUpString());
        }

        [Fact]
        public void ensurePickUpDeliveryGetContactoPickUpNumeroStringIsCorrect()
        {
            PickUpDelivery pickUpDelivery = new PickUpDelivery("12345", "Desc1", 
                                                                "123456789", "ABC",
                                                                "987654321", "CBA",
                                                                "[cel(a1,1,1),cel(a1,2,2)]", "email@email.pt", "id");
            Assert.Equal("123456789", pickUpDelivery.getNumeroContactoPickUpString());
        }

        [Fact]
        public void ensurePickUpDeliveryGetContactoDeliveryNomeStringIsCorrect()
        {
            PickUpDelivery pickUpDelivery = new PickUpDelivery("12345", "Desc1", 
                                                                "123456789", "ABC",
                                                                "987654321", "CBA",
                                                                "[cel(a1,1,1),cel(a1,2,2)]", "email@email.pt", "id");
            Assert.Equal("CBA", pickUpDelivery.getNomeContactoDeliveryString());
        }

        [Fact]
        public void ensurePickUpDeliveryGetContactoDeliveryNumeroStringIsCorrect()
        {
            PickUpDelivery pickUpDelivery = new PickUpDelivery("12345", "Desc1", 
                                                                "123456789", "ABC",
                                                                "987654321", "CBA",
                                                                "[cel(a1,1,1),cel(a1,2,2)]", "email@email.pt", "id");
            Assert.Equal("987654321", pickUpDelivery.getNumeroContactoDeliveryString());
        }
    }
}