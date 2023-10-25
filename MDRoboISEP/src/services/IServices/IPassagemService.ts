import { Result } from "../../core/logic/Result";
import IPassagemDTO from "../../dto/IPassagemDTO";

export default interface IPassagemService  {
    criarPassagem(passagemDTO: IPassagemDTO): Promise<Result<IPassagemDTO>>;
}
