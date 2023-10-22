import { Result } from "../../core/logic/Result";
import ICriarPisoDTO from "../../dto/ICriarPisoDTO";

export default interface IPisoService  {
  criarPiso(criarPisoDTO: ICriarPisoDTO): Promise<Result<ICriarPisoDTO>>;
}
