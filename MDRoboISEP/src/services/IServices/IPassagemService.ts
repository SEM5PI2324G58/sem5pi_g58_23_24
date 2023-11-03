import { Result } from "../../core/logic/Result";
import IListarPassagemDTO from "../../dto/IListarPassagemDTO";
import IListarPassagensPorParDeEdificioDTO from "../../dto/IListarPassagensPorParDeEdificioDTO";
import IPassagemDTO from "../../dto/IPassagemDTO";

export default interface IPassagemService  {
    criarPassagem(passagemDTO: IPassagemDTO): Promise<Result<IPassagemDTO>>;
    listarPassagensPorParDeEdificios(edificiosDTO: IListarPassagensPorParDeEdificioDTO): Promise<Result<IListarPassagemDTO[]>>;
}
