using MDTarefas.Models.tarefa;

namespace MDTarefas.repos.IRepos{

    public interface ITarefaRepo{

        Task<List<Tarefa>> GetAsync();
        Task<Tarefa?> GetAsync(string id);
        Task<Tarefa> CreateAsync(Tarefa newTarefa);
        Task UpdateAsync(string id, Tarefa updatedTarefa);
        Task RemoveAsync(string id);

    }

}