import { Result } from "../../core/logic/Result";
import ICriarElevadorDTO from "../../dto/ICriarElevadorDTO";


export default interface IElevadorService{
    criarElevador(elevadorDTO: ICriarElevadorDTO): Promise<Result<ICriarElevadorDTO>>;
    editarElevador(elevadorDTO: ICriarElevadorDTO): Promise<Result<ICriarElevadorDTO>>;
}