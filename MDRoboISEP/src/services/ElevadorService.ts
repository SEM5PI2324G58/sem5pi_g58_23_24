import IElevadorService from "./IServices/IElevadorService";
import { Result } from "../core/logic/Result";
import { Inject, Service } from "typedi";
import IElevadorRepo from "./IRepos/IElevadorRepo";
import IEdificioRepo from "./IRepos/IEdificioRepo";
import IPisoRepo from "./IRepos/IPisoRepo";
import config from "../../config";
import ICriarElevadorDTO from "../dto/ICriarElevadorDTO";
import { Piso } from "../domain/piso/Piso";
import { IdElevador } from "../domain/elevador/IdElevador";
import { MarcaElvador } from "../domain/elevador/MarcaElevador";
import { ModeloElvador } from "../domain/elevador/ModeloElevador";
import { NumeroSerieElevador } from "../domain/elevador/NumeroSerieElevador";
import { DescricaoElvador } from "../domain/elevador/DescricaoElevador";
import { Ponto } from "../domain/ponto/Ponto";
import { Elevador } from "../domain/elevador/Elevador";


@Service()
export default class ElevadorService implements IElevadorService{
    
    constructor(
        @Inject(config.repos.edificio.name) private edificioRepo : IEdificioRepo,
        @Inject(config.repos.elevador.name) private elevadorRepo : IElevadorRepo
    ){}
    
    
    public async criarElevador(elevadorDTO: ICriarElevadorDTO): Promise<Result<ICriarElevadorDTO>>{
        try {
            
            let edificio = await this.edificioRepo.findByDomainId(elevadorDTO.edificio);

            if (edificio === null){
                return Result.fail<ICriarElevadorDTO>("Edificio não existe.")
            }
            if (edificio.temElevador()){
                return Result.fail<ICriarElevadorDTO>("Edificio já tem um elevador.")
            }
            if (edificio.posicaoValidaNoMapa(elevadorDTO.xCoord,elevadorDTO.yCoord,elevadorDTO.orientacao)){
                return Result.fail<ICriarElevadorDTO>("A posição do elevador não é válida para o edifício")
            }
            
            // Procurar os pisos do edifício com número correspondente aos passados por parâmetro
            let pisosServidos: Piso[] = [];
            let pisosEdificio: Piso[] = edificio.props.listaPisos;

            for (let i = 0; i < pisosEdificio.length;i++ ){
                for(let j = 0; i < elevadorDTO.pisosServidos.length; j++){
                    if(pisosEdificio[i].returnNumeroPiso() === elevadorDTO.pisosServidos[j]){
                        pisosServidos.push(pisosEdificio[i]);
                    }
                }
            }
            
            // Se náo forem encontrados todos os pisos, quer dizer que foram inseridos pisos inválidos
            if(pisosServidos.length !== elevadorDTO.pisosServidos.length){
                return Result.fail<ICriarElevadorDTO>("Foram inseridos pisos inválidos")
            }

            let pontos: Ponto[] = [];
            for (let i = 0; i < pisosServidos.length; i++){
                let pisoPontos = pisosServidos[i].returnPontosParaElevador(elevadorDTO.xCoord,elevadorDTO.yCoord,elevadorDTO.orientacao);
                for(let j = 0; i < pisoPontos.length; j++){
                    pontos.push(pisoPontos[j]);
                }
            }



            let id = await this.elevadorRepo.getMaxId();

            let idElevadorOrError = IdElevador.create(id);
            if(idElevadorOrError.isFailure){
                return Result.fail<ICriarElevadorDTO>(idElevadorOrError.errorValue());
            }
            
            if ((elevadorDTO.marca === null && elevadorDTO.modelo !== null) ||
            (elevadorDTO.marca !== null && elevadorDTO.modelo === null)){
                return Result.fail<ICriarElevadorDTO>('Marca e modelo têm de existir ou não simultâneamente');
            }

            let marcaOrError = MarcaElvador.create(elevadorDTO.marca);
            let modeloOrError = ModeloElvador.create(elevadorDTO.modelo);
            let numeroSerieOrError = NumeroSerieElevador.create(elevadorDTO.numeroSerie);
            let descricaoOrError = DescricaoElvador.create(elevadorDTO.descricao);

            let finalResult = Result.combine([marcaOrError,modeloOrError,numeroSerieOrError,descricaoOrError]);

            if (finalResult.isFailure){
                return Result.fail<ICriarElevadorDTO>(finalResult.errorValue());
            }
            
            const elevadorOuErro = await Elevador.create({
                pisosServidos: pisosServidos,
                pontos : pontos,
                marca: marcaOrError.getValue(),
                modelo: modeloOrError.getValue(),
                numeroSerie: numeroSerieOrError.getValue(),
                descricao: descricaoOrError.getValue(),
            }, idElevadorOrError.getValue());
    
            if (elevadorOuErro.isFailure) {
                return Result.fail<ICriarElevadorDTO>(elevadorOuErro.errorValue());
            }

            edificio.adicionarElevador(elevadorOuErro.getValue());

            await this.elevadorRepo.save(elevadorOuErro.getValue());
            await this.edificioRepo.save(edificio)

            return Result.ok<ICriarElevadorDTO>(elevadorDTO)

        } catch (e) {
            throw e;
        }
    }
        

}