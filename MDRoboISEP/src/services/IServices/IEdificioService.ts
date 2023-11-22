import { Result } from "../../core/logic/Result";
import IEdificioDTO from "../../dto/IEdificioDTO";
import IListarEdMinEMaxPisosDTO from "../../dto/IListarEdMinEMaxPisosDTO";
import IPlaneamentoInfoDTO from "../../dto/IPlaneamentoInfoDTO";

export default interface IEdificioService  {
    getInformacaoPlaneamento(): Promise<Result<IPlaneamentoInfoDTO>>;
    criarEdificio(edificioDTO: IEdificioDTO): Promise<Result<IEdificioDTO>>;
    listarEdificioMinEMaxPisos(listarEdificioMinEMaxPisosDTO: IListarEdMinEMaxPisosDTO): Promise<Result<IEdificioDTO[]>>;
    listarEdificios(): Promise<Result<IEdificioDTO[]>>;
    editarEdificio(edificioDTO: IEdificioDTO): Promise<Result<IEdificioDTO>>;
    deleteEdificio(codigo: string): Promise<Result<IEdificioDTO>>;
}
