using MDTarefas.Models.tarefa.ValueObjects;
using MongoDB.Bson.Serialization.Attributes;

namespace MDTarefas.Models.tarefa
{
    public class Vigilancia : Tarefa {
        [BsonElement("ContactoVigilancia")]
        public Contacto Contacto { get; private set;} = null!;

        public Vigilancia(string nome, string numero, string percurso, string email, string id) : base(id, percurso, email) {
            this.Contacto = new Contacto(new Nome(nome), new NumeroTelefone(numero));
        }
    }

}