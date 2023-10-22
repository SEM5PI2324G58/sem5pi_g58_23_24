import Container from "typedi";
import { Mapper } from "../core/infra/Mapper";
import { DescricaoEdificio } from "../domain/edificio/DescricaoEdificio";
import { Elevador } from "../domain/elevador/Elevador";
import { MarcaElvador } from "../domain/elevador/MarcaElevador";
import { ModeloElvador } from "../domain/elevador/ModeloElevador";
import { NumeroSerieElevador } from "../domain/elevador/NumeroSerieElevador";
import { Piso } from "../domain/piso/Piso";
import IElevadorDTO from "../dto/IElevadorDTO";
import PisoRepo from "../repos/PisoRepo";
import PontoRepo from "../repos/PontoRepo";
import { IdElevador } from "../domain/elevador/IdElevador";

export class ElevadorMap extends Mapper<Elevador>{
    public static toDTO(elevador: Elevador): IElevadorDTO {
        return {
            id: elevador.id.toValue(),
            marca: elevador.props.marca.props.marca,
            modelo: elevador.props.modelo.props.modelo,
            numeroSerie: elevador.props.numeroSerie.props.numeroSerie,
            descricao: elevador.props.descricao.props.descricao
        } as IElevadorDTO;
    }

    public static async toDomain (raw: any): Promise<Elevador>{
        
        
        const pisoRepo = Container.get(PisoRepo);
        const pontoRepo = Container.get(PontoRepo);
        
        let pisosServido: Piso[] = [];
        for (let i = 0; i< raw.pisosServidos.length; i++){
            pisosServido[i] = await pisoRepo.findByDomainId(raw.pisosServidos[i]);
        }
        
        let pontoSup = await pontoRepo.findByDomainId(raw.pontoSup);
        let pontoInf = await pontoRepo.findByDomainId(raw.pontoInf);
        
        const marcaOrError = MarcaElvador.create(raw.marca);
        const modeloOrError = ModeloElvador.create(raw.modelo);
        const numeroSerieOrError = NumeroSerieElevador.create(raw.numeroSerie);
        const descricaoOrError = DescricaoEdificio.create(raw.descricao);
        const idElevador = IdElevador.create(raw.domainId); 
        
        const elevadorOrError = Elevador.create({
            pisosServidos: pisosServido,
            pontoSup : pontoSup,
            pontoInf : pontoInf,
            marca: marcaOrError.getValue(),
            modelo: modeloOrError.getValue(),
            numeroSerie: numeroSerieOrError.getValue(),
            descricao: descricaoOrError.getValue()
        }, idElevador.getValue());

        elevadorOrError.isFailure ? console.log(elevadorOrError.error) : '';

        return elevadorOrError.isSuccess ? elevadorOrError.getValue() : null;
    }

    public static toPersistence (elevador: Elevador): any {
        return {
          domainId: elevador.returnIdElevador(),
          pisosServidos: elevador.returnIdPisosServidos(),
          pontoSup: elevador.returnIdPontoSup(),
          pontoInf: elevador.returnIdPontoInf(),
          marca: elevador.returnMarca(),
          modelo: elevador.returnModelo(),
          numeroSerie: elevador.returnNumeroSerie(),
          descricao: elevador.returnDescricao(),
        }
      }
}