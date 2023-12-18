using MongoDB.Bson.Serialization.Attributes;

namespace MDTarefas.Models.tarefa.ValueObjects{
    
    public class Contacto {
        [BsonElement("NomeContacto")]
        public Nome Nome { get; private set; } = null!;
        [BsonElement("NumeroContacto")]
        public NumeroTelefone NumeroTelefone { get; private set; } = null!;

        public Contacto(Nome nome, NumeroTelefone numeroTelefone)
        {
            this.Nome = nome;
            this.NumeroTelefone = numeroTelefone;
        }
    }
    
}
