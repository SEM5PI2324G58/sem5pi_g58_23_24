using MDTarefas.dto;
using MDTarefas.Models.tarefa;
using MDTarefas.Services;
using Microsoft.AspNetCore.Mvc;

namespace MDTarefas.Controller;

[ApiController]
[Route("/api/[controller]")]
public class TarefaController : ControllerBase
{
    private readonly TarefaService _tarefaService;

    public TarefaController(TarefaService tarefaService)
    {
        _tarefaService = tarefaService;
    }

    [HttpGet("GetAll")]
    public async Task<ActionResult<List<TarefaDTO>>> Get() {
        var tarefas = await _tarefaService.listarTarefas();
        return Ok(tarefas);
    }

    [HttpPost("Create")]
    public async Task<ActionResult<Tarefa>> Create(CriarTarefaDTO tarefa)
    {
        Tarefa tarefacriada = await _tarefaService.criarTarefa(tarefa);
        return Created(tarefacriada.Id, tarefacriada);  
    }

}