using MDTarefas.dto;
using MDTarefas.Models.exceptions;
using MDTarefas.Models.tarefa;
using MDTarefas.Services;
using MDTarefas.Services.IServices;
using Microsoft.AspNetCore.Mvc;

namespace MDTarefas.Controller;

[ApiController]
[Route("/api/[controller]")]
public class TarefaController : ControllerBase
{
    private readonly ITarefaService _tarefaService;

    public TarefaController(ITarefaService tarefaService)
    {
        _tarefaService = tarefaService;
    }

    [HttpGet]
    public async Task<ActionResult<List<TarefaDTO>>> Get() {
        var tarefas = await _tarefaService.listarTarefas();
        return Ok(tarefas);
    }

    [HttpPost]
    public async Task<ActionResult<TarefaDTO>> Create(CriarTarefaDTO tarefa)
    {
        try {
            TarefaDTO tarefacriada = await _tarefaService.criarTarefa(tarefa);
            return Created(tarefacriada.Id,tarefacriada);  
        } catch (BusinessRuleValidationException e) {
            return BadRequest(e.Message);
        }
    }
}