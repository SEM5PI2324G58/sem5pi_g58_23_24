import { Result } from "../../core/logic/Result";
import ICriarPisoDTO from "../../dto/ICriarPisoDTO";
import IPisoDTO from "../../dto/IPisoDTO";

export default interface IPisoService  {
  criarPiso(criarPisoDTO: ICriarPisoDTO): Promise<Result<ICriarPisoDTO>>;
  listarTodosOsPisosDeUmEdificio(codigo: string): Promise<Result<IPisoDTO[]>>;
}
