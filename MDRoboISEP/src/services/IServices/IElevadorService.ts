import { Result } from "../../core/logic/Result";
import { Edificio } from "../../domain/edificio/Edificio";
import { Elevador } from "../../domain/elevador/Elevador";
import { Piso } from "../../domain/piso/Piso";
import ICarregarPisoDTO from "../../dto/ICarregarPisoDTO";
import ICriarElevadorDTO from "../../dto/ICriarElevadorDTO";
import IElevadorDTO from "../../dto/IElevadorDTO";


export default interface IElevadorService{
    criarElevador(elevadorDTO: ICriarElevadorDTO): Promise<Result<ICriarElevadorDTO>>;
    editarElevador(elevadorDTO: ICriarElevadorDTO): Promise<Result<ICriarElevadorDTO>>;
    listarElevadoresDoEdificio(codigoEdificio: string): Promise<Result<IElevadorDTO>>;
}