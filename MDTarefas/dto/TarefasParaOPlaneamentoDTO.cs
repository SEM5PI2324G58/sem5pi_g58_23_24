namespace MDTarefas.dto;

public class TarefasParaOPlaneamentoDTO
{

    public string[]? Robot { get; set; }
    public int Algoritmo { get; set; }

    public TarefasParaOPlaneamentoDTO() {
    }
    public TarefasParaOPlaneamentoDTO(string[] robot, int algoritmo) {
        this.Robot =  robot;
        this.Algoritmo = algoritmo;
    }

}