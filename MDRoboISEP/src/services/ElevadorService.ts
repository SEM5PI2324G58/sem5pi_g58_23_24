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
import {Edificio} from "../domain/edificio/Edificio";
import ICarregarPisoDTO from "../dto/ICarregarPisoDTO";


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
            
            // Procurar os pisos do edifício com número correspondente aos passados por parâmetro

            let pisosServidos = edificio.pisosCorrespondentes(elevadorDTO.pisosServidos);
            
            // Se náo forem encontrados todos os pisos, quer dizer que foram inseridos pisos inválidos
            if(pisosServidos.length !== elevadorDTO.pisosServidos.length){
                return Result.fail<ICriarElevadorDTO>("Foram inseridos pisos inválidos")
            }

            // array de pontos vazio ao criar elevador
            let pontos: Ponto[] = [];

            let id = await this.elevadorRepo.getMaxId();

            let idElevadorOrError = IdElevador.create(id+1);
            if(idElevadorOrError.isFailure){
                return Result.fail<ICriarElevadorDTO>(idElevadorOrError.errorValue());
            }
            
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

            await this.elevadorRepo.save(elevadorOuErro.getValue());
            await this.edificioRepo.save(edificio)

            return Result.ok<ICriarElevadorDTO>(elevadorDTO)

        } catch (e) {
            throw e;
        }
    }

    
/**
     * Este método serve para criar um elevador ou adicionar um piso a um elevador já existente
     * @param elevadorDTO ElevadorDTO
     * @param edificio Edifício ao qual o elevador pertence
     * @param piso Piso ao qual o elevador vai serivir
     * @returns Result<Edificio> Quando tem sucesso retorna o edifício com o elevador criado ou atualizado
     */
    public async carregarElevadorPiso(edificio: Edificio,piso : Piso, informacaoPiso : ICarregarPisoDTO): Promise<Result<Elevador>>{
        try{
            if (edificio.temElevador()){
                let elevador = edificio.returnElevador();
                if(elevador.returnDescricao() === informacaoPiso.elevador.descricao &&
                elevador.returnMarca() === informacaoPiso.elevador.marca &&
                elevador.returnModelo() === informacaoPiso.elevador.modelo &&
                elevador.returnNumeroSerie() === informacaoPiso.elevador.numeroSerie){

                    if(elevador.returnIdPontos().length === 0){
                        let verif= await this.verificarSeElevadorEstaNumaPosicaoValida(informacaoPiso, edificio.returnDimensaoX(), edificio.returnDimensaoY());
                        if(verif.isFailure){
                            return Result.fail<Elevador>(verif.errorValue());
                        }
                        const listaPontos = this.criarListaPontos(informacaoPiso, piso);

                        let listaPontosFinal = elevador.pontosAtuais().concat(listaPontos);
                        elevador.updatePontos(listaPontosFinal);
                        return Result.ok<Elevador>(elevador);
                    }
                }
            }else{
                return Result.fail<Elevador>("O edifício não tem elevador.");
            }
        }catch(e){
            throw e;
        }
    }

    private async verificarSeElevadorEstaNumaPosicaoValida(informacaoPiso : ICarregarPisoDTO, edificioDimensaoX : number, edificioDimensaoY:number): Promise<Result<Elevador>>{
        let xCoordSup = informacaoPiso.elevador.xCoord;
        let yCoordSup = informacaoPiso.elevador.yCoord;
        let xCoordInf : number;
        let yCoordInf : number;
    
        if (informacaoPiso.elevador.orientacao === 'norte') {
          xCoordInf = xCoordSup;
          yCoordInf = yCoordSup + 1;
        } else if (informacaoPiso.elevador.orientacao === 'oeste') {
          xCoordInf = xCoordSup + 1;
          yCoordInf = yCoordSup;
        }
    
        // Coordendas do ponto inferior têm de estar dentro das dimensões do edifício
        if (xCoordInf >= edificioDimensaoX || yCoordInf >= edificioDimensaoY || xCoordSup < 0 || yCoordSup < 0) {
          return Result.fail<Elevador>('O elevador tem de estar integralmente dentro do edifício');
        }

        if(this.verificarSeElevadorEstaNoInteriorDaSala(informacaoPiso, xCoordSup, yCoordSup, xCoordInf, yCoordInf)){
            return Result.fail<Elevador>('O elevador não pode estar no interior de uma sala');
        }

        if(this.verificarSeElevadorEstaAFrenteDeUmaPassagem(informacaoPiso, xCoordSup, yCoordSup, xCoordInf, yCoordInf, edificioDimensaoX, edificioDimensaoY)){
            return Result.fail<Elevador>('O elevador não pode estar à frente de uma passagem');
        }

        if(this.verificaSeElevadorAFrenteDePorta()){
            return Result.fail<Elevador>('O elevador não pode estar à frente de uma porta');
        }
    }

        private verificarSeElevadorEstaNoInteriorDaSala(informacaoPiso : ICarregarPisoDTO, xCoordSup : number, yCoordSup : number,
                 xCoordInf : number, yCoordInf : number) : boolean{
        const arraySalas = informacaoPiso.salas;

        for(let sala of arraySalas){
            let pontoSalaInf;
            let pontoSalaSup;

            if(sala.abcissaA > sala.abcissaB || sala.ordenadaA > sala.ordenadaB){
                pontoSalaInf = [sala.abcissaA, sala.ordenadaA]
                pontoSalaSup = [sala.abcissaB, sala.ordenadaB];
            }else{
                pontoSalaInf = [sala.abcissaB, sala.ordenadaB]
                pontoSalaSup = [sala.abcissaA, sala.ordenadaA];
            }

            if(xCoordInf > pontoSalaSup[0] && xCoordInf < pontoSalaInf[0] && yCoordInf > pontoSalaSup[1] && yCoordInf < pontoSalaInf[1] ||
                xCoordSup > pontoSalaSup[0] && xCoordSup < pontoSalaInf[0] && yCoordSup > pontoSalaSup[1] && yCoordSup < pontoSalaInf[1]){
                return false;
            }
        }
        return true;
    }

    private verificarSeElevadorEstaAFrenteDeUmaPassagem(informacaoPiso : ICarregarPisoDTO, xCoordSup : number, yCoordSup : number,
        xCoordInf : number, yCoordInf : number, edificioDimensaoX : number, edificioDimensaoY:number): boolean{

        let passagemSup = [informacaoPiso.passagem.abcissa, informacaoPiso.passagem.ordenada];
        let passagemInf;

        if(informacaoPiso.passagem.orientacao === 'norte'){
            passagemInf = [informacaoPiso.passagem.abcissa, informacaoPiso.passagem.ordenada + 1];
        }else{
            passagemInf = [informacaoPiso.passagem.abcissa + 1, informacaoPiso.passagem.ordenada];
        }

        if(passagemSup[0] === 0 && passagemInf[0] === 0){
            if(xCoordInf === passagemSup[0] + 1 || xCoordInf === passagemInf[0] + 1 || xCoordSup === passagemSup[0] + 1 || xCoordSup === passagemInf[0] + 1){
                if(yCoordInf === passagemSup[1] || yCoordInf === passagemInf[1] || yCoordSup === passagemSup[1] || yCoordSup === passagemInf[1]){
                    return false;
                }
            }
        }else if(passagemSup[1] === 0 && passagemInf[1] === 0){
            if(yCoordInf === passagemSup[1] + 1 || yCoordInf === passagemInf[1] + 1 || yCoordSup === passagemSup[1] + 1 || yCoordSup === passagemInf[1] + 1){
                if(xCoordInf === passagemSup[0] || xCoordInf === passagemInf[0] || xCoordSup === passagemSup[0] || xCoordSup === passagemInf[0]){
                    return false;
                }

            }
        }else if(passagemSup[0] === edificioDimensaoX - 1 && passagemInf[0] === edificioDimensaoX - 1){
            if(xCoordInf === passagemSup[0] - 1 || xCoordInf === passagemInf[0] - 1 || xCoordSup === passagemSup[0] - 1 || xCoordSup === passagemInf[0] - 1){
                if(yCoordInf === passagemSup[1] || yCoordInf === passagemInf[1] || yCoordSup === passagemSup[1] || yCoordSup === passagemInf[1]){
                    return false;
                }
            }
        }else if(passagemSup[1] === edificioDimensaoY - 1 && passagemInf[1] === edificioDimensaoY - 1){
            if(yCoordInf === passagemSup[1] - 1 || yCoordInf === passagemInf[1] - 1 || yCoordSup === passagemSup[1] - 1 || yCoordSup === passagemInf[1] - 1){
                if(xCoordInf === passagemSup[0] || xCoordInf === passagemInf[0] || xCoordSup === passagemSup[0] || xCoordSup === passagemInf[0]){
                    return false;
                }
             }
        }
        return true;
    }

    //////////////////TODO////////////////////////
    private verificaSeElevadorAFrenteDePorta(): boolean{
        // por implementar
        return false;
    }

    private criarListaPontos(informacaoPiso : ICarregarPisoDTO, piso : Piso) : Ponto[]{
        let listaPontos : Ponto[] = [];
                    
        let xCoordSup = informacaoPiso.elevador.xCoord;
        let yCoordSup = informacaoPiso.elevador.yCoord;
        let xCoordInf : number;
        let yCoordInf : number;
        if (informacaoPiso.elevador.orientacao === 'norte') {
            xCoordInf = xCoordSup;
            yCoordInf = yCoordSup + 1;
        } else if (informacaoPiso.elevador.orientacao === 'oeste') {
            xCoordInf = xCoordSup + 1;
            yCoordInf = yCoordSup;
        }

        listaPontos = piso.returnPontosParaElevador(xCoordSup,yCoordSup,informacaoPiso.elevador.orientacao);

        for(let ponto of listaPontos){
            ponto.toElevador();
        }
        return listaPontos;
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

            var pisosServidos: Piso[] = [];

            if (elevadorDTO.pisosServidos !== undefined){
                // Procurar os pisos do edifício com número correspondente aos passados por parâmetro
                pisosServidos = edificio.pisosCorrespondentes(elevadorDTO.pisosServidos);

                // Se náo forem encontrados todos os pisos, quer dizer que foram inseridos pisos inválidos
                if(pisosServidos.length !== elevadorDTO.pisosServidos.length){
                    return Result.fail<ICriarElevadorDTO>("Foram inseridos pisos inválidos")
                }

                elevador.updatePisos(pisosServidos);
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
                return Result.fail<IElevadorDTO>("Edifício não existe.")
            }
            
            let elevador = edificio.returnElevador();

            if (elevador === null){
                return Result.fail<IElevadorDTO>("O edifício não tem elevadores.")
            }
            
            return Result.ok<IElevadorDTO>(ElevadorMap.toDTO(elevador))
        } catch (e) {
            throw e;
        }
    }
}