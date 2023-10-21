import { Result } from "../../core/logic/Result";
import IEdificioDTO from "../../dto/IEdificioDTO";

export default interface IEdificioService  {
    criarEdificio(roleDTO: IEdificioDTO): Promise<Result<IEdificioDTO>>;
}
