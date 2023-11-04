import { Result } from "../../core/logic/Result";
import IDispositivoDTO from "../../dto/IDispositivoDTO";
import IAdicionarRoboAFrotaDTO from "../../dto/IAdicionarRoboAFrotaDTO";
import IDispositivoInibirDTO from "../../dto/IDispositivoInibirDTO";

export default interface IEdificioService  {
    inibirDispositivo(dispositivoDTO: IDispositivoInibirDTO): Promise<Result<IDispositivoInibirDTO>>;
    adicionarDispositivoAFrota(adicionarRoboAFrotaDTO: IAdicionarRoboAFrotaDTO ): Promise<Result<IDispositivoDTO>>;
    listarDispositivosDaFrota(): Promise<Result<IDispositivoDTO[]>>;    
}
