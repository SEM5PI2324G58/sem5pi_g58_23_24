import { Result } from "../../core/logic/Result";
import { Edificio } from "../../domain/edificio/Edificio";
import { Piso } from "../../domain/piso/Piso";
import ICriarElevadorDTO from "../../dto/ICriarElevadorDTO";
import IElevadorDTO from "../../dto/IElevadorDTO";


export default interface IElevadorService{
    criarElevador(elevadorDTO: ICriarElevadorDTO): Promise<Result<ICriarElevadorDTO>>;
    editarElevador(elevadorDTO: ICriarElevadorDTO): Promise<Result<ICriarElevadorDTO>>;
    listarElevadoresDoEdificio(codigoEdificio: string): Promise<Result<IElevadorDTO>>;
    carregarElevadorPiso(elevadorDTO: ICriarElevadorDTO, edificio: Edificio,piso : Piso): Promise<Result<Edificio>>
}