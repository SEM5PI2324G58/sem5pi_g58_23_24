using MDTarefas.dto;
using MDTarefas.mappers;
using MDTarefas.Models.tarefa;
using MDTarefas.repo;

namespace MDTarefas.Services
{
    public class TarefaService
    {
        private readonly TarefaRepo _tarefaRepository;

        public TarefaService(TarefaRepo tarefaRepository)
        {
            _tarefaRepository = tarefaRepository;
        }

        public async Task<List<TarefaDTO>> listarTarefas() {
            List<Tarefa> list =  await _tarefaRepository.GetAsync();
            List<TarefaDTO> listDTO = new List<TarefaDTO>();
            foreach (Tarefa tarefa in list) {
                listDTO.Add(TarefaMapper.toDTO(tarefa));
            }
            return listDTO;
        }

        public async Task<Tarefa?> listarTarefaPorId(string id) {
            return await _tarefaRepository.GetAsync(id);
        }

        public async Task<Tarefa> criarTarefa(CriarTarefaDTO tarefaDTO) {
            if (tarefaDTO.TipoTarefa == "PickUpDelivery") {
                return await criarPickUpDelivery(tarefaDTO);
            } else if (tarefaDTO.TipoTarefa == "Vigilancia") {
                return await criarVigilancia(tarefaDTO);
            } else {
                throw new Exception("Tipo de tarefa inválido");
            }
        }

        private async Task<Tarefa> criarPickUpDelivery(CriarTarefaDTO tarefaDTO){
            if (tarefaDTO.CodConfirmacao == null || tarefaDTO.DescricaoEntrega == null ||
                tarefaDTO.NomePickUp == null || tarefaDTO.NumeroPickUp == null ||
                tarefaDTO.NomeDelivery == null || tarefaDTO.NumeroDelivery == null) {
                throw new Exception("Dados inválidos");
            }

            PickUpDelivery tarefa = new PickUpDelivery(
                tarefaDTO.CodConfirmacao,
                tarefaDTO.DescricaoEntrega,
                tarefaDTO.NumeroPickUp,
                tarefaDTO.NomePickUp,
                tarefaDTO.NumeroDelivery,
                tarefaDTO.NomeDelivery,
                "percurso",
                "email",
                "223456789012345678901234"
            );

            await _tarefaRepository.CreateAsync(tarefa);
            return tarefa;
        }

        private async Task<Tarefa> criarVigilancia(CriarTarefaDTO tarefaDTO){
            if (tarefaDTO.NomeVigilancia == null || tarefaDTO.NumeroVigilancia == null) {
                throw new Exception("Dados inválidos");
            }

            Vigilancia tarefa = new Vigilancia(
                tarefaDTO.NomeVigilancia,
                tarefaDTO.NumeroVigilancia,
                "percurso",
                "email",
                "223456789012345678901234"
            );

            await _tarefaRepository.CreateAsync(tarefa);
            return tarefa;
        }
    }
}