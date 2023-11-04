import { Result } from "../../core/logic/Result";
import ICarregarMapaDTO from "../../dto/ICarregarMapaDTO";

export default interface IPontoService {
    carreagarMapa(json : string) : Promise<Result<ICarregarMapaDTO>>;
}