using MDTarefas.dto;

namespace MDTarefas.Services.IServices {
    public interface ITarefaService {
        Task<List<TarefaDTO>> listarTarefas();
        Task<TarefaDTO?> listarTarefaPorId(string id);
        Task<TarefaDTO> criarTarefa(CriarTarefaDTO tarefaDTO);
        Task<List<TarefaDTO>> listarTarefasPendentes();
        Task removerTarefaPorId(string id);
    }
}