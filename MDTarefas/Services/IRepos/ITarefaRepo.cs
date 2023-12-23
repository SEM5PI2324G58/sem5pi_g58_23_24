using MDTarefas.Models.tarefa;

namespace MDTarefas.services.IRepos{

    public interface ITarefaRepo{

        Task<List<Tarefa>> GetAsync();
        Task<Tarefa?> GetAsync(string id);
        Task<List<Tarefa>> GetTarefasPendentesAsync();
        Task<Tarefa> CreateAsync(Tarefa newTarefa);
        Task UpdateAsync(string id, Tarefa updatedTarefa);
        Task<bool> RemoveAsync(string id);

    }

}