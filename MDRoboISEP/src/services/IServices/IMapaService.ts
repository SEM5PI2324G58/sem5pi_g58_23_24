import { Result } from "../../core/logic/Result";
import ICarregarMapaDTO from "../../dto/ICarregarMapaDTO";
import IExportarMapaDTO from "../../dto/IExportarMapaDTO";

export default interface IMapaService{
    carregarMapa(json : ICarregarMapaDTO) : Promise<Result<ICarregarMapaDTO>>;
    exportarMapa(mapaDTO : IExportarMapaDTO) : Promise<Result<IExportarMapaDTO>>;
}