using MDTarefas.Models.tarefa.ValueObjects;
using MongoDB.Bson.Serialization.Attributes;

namespace MDTarefas.Models.tarefa
{
    public class Vigilancia : Tarefa {
        private Contacto Contacto = null!;

        public Vigilancia(string nome, string numero, string percurso, string email, string id) : base(id, percurso, email) {
            this.Contacto = new Contacto(new Nome(nome), new NumeroTelefone(numero));
        }

        public string getContactoNomeString() {
            return this.Contacto.getNomeString();
        }

        public string getContactoNumeroString() {
            return this.Contacto.getNumeroTelefoneString();
        }
    }

}