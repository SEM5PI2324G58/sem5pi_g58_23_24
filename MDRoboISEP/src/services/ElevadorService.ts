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
import { MarcaElevador } from "../domain/elevador/MarcaElevador";
import { ModeloElevador } from "../domain/elevador/ModeloElevador";
import { NumeroSerieElevador } from "../domain/elevador/NumeroSerieElevador";
import { DescricaoElevador } from "../domain/elevador/DescricaoElevador";
import { Ponto } from "../domain/ponto/Ponto";
import { Elevador } from "../domain/elevador/Elevador";
import IPontoRepo from "./IRepos/IPontoRepo";
import IElevadorDTO from "../dto/IElevadorDTO";
import { ElevadorMap } from "../mappers/ElevadorMap";


@Service()
export default class ElevadorService implements IElevadorService{
    
    constructor(
        @Inject(config.repos.edificio.name) private edificioRepo : IEdificioRepo,
        @Inject(config.repos.elevador.name) private elevadorRepo : IElevadorRepo,
        @Inject(config.repos.ponto.name) private pontoRepo : IPontoRepo
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

            if (!edificio.posicaoValidaNoMapa(elevadorDTO.xCoord,elevadorDTO.yCoord,elevadorDTO.orientacao)){
                return Result.fail<ICriarElevadorDTO>("A posição do elevador não é válida para o edifício")
            }
            
            // Procurar os pisos do edifício com número correspondente aos passados por parâmetro
            let pisosServidos: Piso[] = [];
            let pisosEdificio: Piso[] = edificio.props.listaPisos;

            for (let i = 0; i < pisosEdificio.length;i++ ){
                for(let j = 0; j < elevadorDTO.pisosServidos.length; j++){
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
                for(let j = 0; j < pisoPontos.length; j++){
                    pontos.push(pisoPontos[j]);
                }
            }



            let id = await this.elevadorRepo.getMaxId();

            let idElevadorOrError = IdElevador.create(id+1);
            if(idElevadorOrError.isFailure){
                return Result.fail<ICriarElevadorDTO>(idElevadorOrError.errorValue());
            }
            /*
            // TODO mudar para o domínio 
            if ((elevadorDTO.marca === null && elevadorDTO.modelo !== null) ||
            (elevadorDTO.marca !== null && elevadorDTO.modelo === null)){
                return Result.fail<ICriarElevadorDTO>('Marca e modelo têm de existir ou não simultâneamente');
            }
            */

            let marcaOrError = MarcaElevador.create(elevadorDTO.marca);
            let modeloOrError = ModeloElevador.create(elevadorDTO.modelo);
            let numeroSerieOrError = NumeroSerieElevador.create(elevadorDTO.numeroSerie);
            let descricaoOrError = DescricaoElevador.create(elevadorDTO.descricao);

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

            for (let i = 0; i< pontos.length; i++){
                pontos[i].toElevador();
                await this.pontoRepo.save(pontos[i]);
            }

            await this.elevadorRepo.save(elevadorOuErro.getValue());
            await this.edificioRepo.save(edificio)

            return Result.ok<ICriarElevadorDTO>(elevadorDTO)

        } catch (e) {
            throw e;
        }
    }
        
    public async editarElevador(elevadorDTO: ICriarElevadorDTO): Promise<Result<ICriarElevadorDTO>>{
        try {
            let edificio = await this.edificioRepo.findByDomainId(elevadorDTO.edificio);

            if (edificio === null){
                return Result.fail<ICriarElevadorDTO>("Edificio não existe.")
            }

            let elevador = edificio.returnElevador();
            
            if (elevador === null){
                return Result.fail<ICriarElevadorDTO>("Elevador não existe.")
            }

            var pisosServidosAnte = elevador.pisosServidosAtuais()
            var pisosServidos: Piso[] = [];

            if (elevadorDTO.pisosServidos !== undefined){
                // Procurar os pisos do edifício com número correspondente aos passados por parâmetro
                pisosServidos = edificio.pisosCorrespondentes(elevadorDTO.pisosServidos);

                // Se náo forem encontrados todos os pisos, quer dizer que foram inseridos pisos inválidos
                if(pisosServidos.length !== elevadorDTO.pisosServidos.length){
                    return Result.fail<ICriarElevadorDTO>("Foram inseridos pisos inválidos")
                }

                elevador.updatePisos(pisosServidos);
            }else{
                pisosServidos = elevador.pisosServidosAtuais();
            }

            
            let coords = elevador.posicao();

            let pontosAntigos: Ponto[] = [];
            // se for para alterar os pisos ou a posição, eliminar o elevador dos mapas dos pisos antigos 
            if (elevadorDTO.pisosServidos !== undefined || (elevadorDTO.xCoord !== undefined && elevadorDTO.yCoord !== undefined && elevadorDTO.orientacao !== undefined) ){
                
                for (let i = 0; i < pisosServidosAnte.length; i++){
                    pisosServidosAnte[i].reverterElevadorNoMapa(coords);
                    let pontosPiso = pisosServidosAnte[i].returnPontosComCoordenadas(coords);
                    for(let j = 0; j < pontosPiso.length; j++){
                        pontosAntigos.push(pontosPiso[j]);
                    }
                }
                
            }
            
            let pontos: Ponto[] = [];

            if (elevadorDTO.xCoord !== undefined && elevadorDTO.yCoord !== undefined && elevadorDTO.orientacao !== undefined){

                if (!edificio.posicaoValidaNoMapa(elevadorDTO.xCoord,elevadorDTO.yCoord,elevadorDTO.orientacao)){
                    return Result.fail<ICriarElevadorDTO>("A posição do elevador não é válida para o edifício")
                }
                
                for (let i = 0; i < pisosServidos.length; i++){
                    let pisoPontos = pisosServidos[i].returnPontosParaElevador(elevadorDTO.xCoord,elevadorDTO.yCoord,elevadorDTO.orientacao);
                    for(let j = 0; j < pisoPontos.length; j++){
                        pontos.push(pisoPontos[j]);
                    }
                }

                elevador.updatePontos(pontos)

            }else if (elevadorDTO.xCoord === undefined && elevadorDTO.yCoord === undefined && elevadorDTO.orientacao === undefined && elevadorDTO.pisosServidos !== undefined ){

                if (!edificio.posicaoValidaNoMapa(coords[0],coords[1],elevador.orientacao())){
                    return Result.fail<ICriarElevadorDTO>("A posição do elevador não é válida para o edifício")
                }
                
                for (let i = 0; i < pisosServidos.length; i++){
                    let pisoPontos = pisosServidos[i].returnPontosParaElevador(coords[0],coords[1],elevador.orientacao());
                    for(let j = 0; j < pisoPontos.length; j++){
                        pontos.push(pisoPontos[j]);
                    }
                }

                elevador.updatePontos(pontos);

            }else if (elevadorDTO.xCoord === undefined && elevadorDTO.yCoord === undefined && elevadorDTO.orientacao === undefined && elevadorDTO.pisosServidos === undefined){
                // Do nothing
            }else{
                return Result.fail<ICriarElevadorDTO>("Para alterar a posição do elevador é necessário coordenadada x, coordenada y e a orientação")
            }
            
            if (elevadorDTO.marca !== undefined){
                let marcaOrErro = MarcaElevador.create(elevadorDTO.marca);
                if(marcaOrErro.isFailure){
                    return Result.fail<ICriarElevadorDTO>(marcaOrErro.errorValue());
                }else{
                    elevador.updateMarca(marcaOrErro.getValue());
                }
            }

            if (elevadorDTO.modelo !== undefined){
                let modeloOrErro = ModeloElevador.create(elevadorDTO.modelo);
                if(modeloOrErro.isFailure){
                    return Result.fail<ICriarElevadorDTO>(modeloOrErro.errorValue());
                }else{
                    elevador.updateModelo(modeloOrErro.getValue());
                }
            }

            if (elevadorDTO.numeroSerie !== undefined){
                let numeroSerieOrErro = NumeroSerieElevador.create(elevadorDTO.numeroSerie);
                if(numeroSerieOrErro.isFailure){
                    return Result.fail<ICriarElevadorDTO>(numeroSerieOrErro.errorValue());
                }else{
                    elevador.updateNumeroSerie(numeroSerieOrErro.getValue());
                }
            }

            if (elevadorDTO.descricao !== undefined){
                let descricaoOrErro = DescricaoElevador.create(elevadorDTO.descricao);
                if(descricaoOrErro.isFailure){
                    return Result.fail<ICriarElevadorDTO>(descricaoOrErro.errorValue());
                }else{
                    elevador.updateDescricao(descricaoOrErro.getValue());
                }
            }
            
            // Guardar os pontosAntigos se necessário
            for (let i = 0; i< pontosAntigos.length; i++){
                await this.pontoRepo.save(pontosAntigos[i]);
            }

            // Guardar os pontos se necessário
            for (let i = 0; i< pontos.length; i++){
                pontos[i].toElevador();
                await this.pontoRepo.save(pontos[i]);
            }

            this.elevadorRepo.save(elevador);
            
            return Result.ok<ICriarElevadorDTO>(elevadorDTO)
        } catch (e) {
            throw e;
        }
    }

    public async listarElevadoresDoEdificio(codigoEdificio: string): Promise<Result<IElevadorDTO>>{
        try {
            let edificio = await this.edificioRepo.findByDomainId(codigoEdificio);

            if (edificio === null){
                return Result.fail<IElevadorDTO>("Edificio não existe.")
            }
            
            let elevador = edificio.returnElevador();

            if (elevador === null){
                return Result.fail<IElevadorDTO>("Edificio não tem elevador.")
            }
            
            return Result.ok<IElevadorDTO>(ElevadorMap.toDTO(elevador))
        } catch (e) {
            throw e;
        }
    }
}