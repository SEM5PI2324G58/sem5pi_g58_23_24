import { Result } from "../../core/logic/Result";


export default interface IPlaneamentoService  {
    encontrarCaminhosEntreEdificios(salaInicial: string, salaFinal: string): Promise<Result<String>>
}
