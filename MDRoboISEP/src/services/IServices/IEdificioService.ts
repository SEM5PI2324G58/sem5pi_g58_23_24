import { Result } from "../../core/logic/Result";
import IEdificioDTO from "../../dto/IEdificioDTO";
import IListarEdMinEMaxPisosDTO from "../../dto/IListarEdMinEMaxPisosDTO";

export default interface IEdificioService  {
    criarEdificio(edificioDTO: IEdificioDTO): Promise<Result<IEdificioDTO>>;
    listarEdificioMinEMaxPisos(listarEdificioMinEMaxPisosDTO: IListarEdMinEMaxPisosDTO): Promise<Result<IEdificioDTO[]>>;
    listarEdificios(): Promise<Result<IEdificioDTO[]>>;
}
