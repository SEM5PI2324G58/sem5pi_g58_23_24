import { Result } from "../../core/logic/Result";
import IDispositivoDTO from "../../dto/IDispositivoDTO";
import IAdicionarRoboAFrotaDTO from "../../dto/IAdicionarRoboAFrotaDTO";

export default interface IEdificioService  {
    adicionarDispositivoAFrota(adicionarRoboAFrotaDTO: IAdicionarRoboAFrotaDTO ): Promise<Result<IDispositivoDTO>>;
    listarDispositivosDaFrota(): Promise<Result<IDispositivoDTO[]>>;    
}
