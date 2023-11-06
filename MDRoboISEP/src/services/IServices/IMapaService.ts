import { Result } from "../../core/logic/Result";
import ICarregarMapaDTO from "../../dto/ICarregarMapaDTO";

export default interface IMapaService{
    carregarMapa(json : ICarregarMapaDTO) : Promise<Result<ICarregarMapaDTO>>;
}