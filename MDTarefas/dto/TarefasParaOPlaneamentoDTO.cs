namespace MDTarefas.dto;

public class TarefasParaOPlaneamentoDTO
{

    public string[]? Robot { get; set; }
    public bool Algoritmo { get; set; }

    public TarefasParaOPlaneamentoDTO() {
    }
    public TarefasParaOPlaneamentoDTO(string[] robot, bool algoritmo) {
        this.Robot =  robot;
        this.Algoritmo = algoritmo;
    }

}