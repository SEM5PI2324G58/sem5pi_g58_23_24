import { Inject, Service } from "typedi";
import IPontoService from "./IServices/IPontoService";
import config from "../../config";
import IPontoRepo from "./IRepos/IPontoRepo";
import ICarregarMapaDTO from "../dto/ICarregarMapaDTO";
import { Result } from "../core/logic/Result";
import { Edificio } from "../domain/edificio/Edificio";
import { Piso } from "../domain/piso/Piso";
import IEdificioRepo from "./IRepos/IEdificioRepo";
import ISalaRepo from "./IRepos/ISalaRepo";
import IPassagemRepo from "./IRepos/IPassagemRepo";
import { Ponto } from "../domain/ponto/Ponto";
import { Passagem } from "../domain/passagem/Passagem";
import { Sala } from "../domain/sala/Sala";
import IElevadorRepo from "./IRepos/IElevadorRepo";
import { TipoPonto } from "../domain/ponto/TipoPonto";
import { Coordenadas } from "../domain/ponto/Coordenadas";
import { IdPonto } from "../domain/ponto/IdPonto";
@Service()
export default class PontoService implements IPontoService{
    constructor(
        @Inject(config.repos.ponto.name) private pontoRepo: IPontoRepo,
        @Inject(config.repos.edificio.name) private edifRepo: IEdificioRepo,
        @Inject(config.repos.elevador.name) private elevadorRepo: IElevadorRepo,
        @Inject(config.repos.sala.name) private salaRepo: ISalaRepo,
        @Inject(config.repos.passagem.name) private passagemRepo: IPassagemRepo,
        
    ) {}

    public async carreagarMapa(json : string) : Promise<Result<ICarregarMapaDTO>>{


        let informacaoPisoOrError : ICarregarMapaDTO;
        try{
            informacaoPisoOrError = JSON.parse(json);
        }catch(e){
            return Result.fail<ICarregarMapaDTO>("O JSON inserido não é válido.");
        }
        const edificioOrError = await this.verificarSeEdificioExiste(informacaoPisoOrError.codigoEdificio);
        if(edificioOrError.isFailure){
            return Result.fail<ICarregarMapaDTO>(edificioOrError.errorValue());
        }
        const pisoOrError = await this.verificarSePisoExiste(edificioOrError.getValue(), informacaoPisoOrError.numeroPiso);    
        if(pisoOrError.isFailure){
            return Result.fail<ICarregarMapaDTO>(pisoOrError.errorValue());
        }

        // Criação de bermas mapa
        let x = edificioOrError.getValue().props.dimensao.props.x;
        let y = edificioOrError.getValue().props.dimensao.props.y;
        for (let i = 0; i <= x; i++) {
            for (let j = 0; j <= y ; j++) {
                if(i == 0 && j ==0 ) {pisoOrError.getValue().props.mapa[i][j].toParedeNorteOeste();}
                else if((1 <= i && i < x && (j == 0 || j == y)) || (i == 0 && j == y)) {pisoOrError.getValue().props.mapa[i][j].toParedeNorte;}
                else if((1 <= j && j < y && (i == 0 || i == x)) || (i == x && j == 0)) {pisoOrError.getValue().props.mapa[i][j].toParedeOeste();}
                else{pisoOrError.getValue().props.mapa[i][j].toVazio();}
            }
        }  

    
        // Elevador

        if(!this.verificarSeElevadorValido(edificioOrError.getValue(), pisoOrError.getValue(), informacaoPisoOrError)){
            return Result.fail<ICarregarMapaDTO>("O elevador não é válido.");
        }

        const listaPontosElevador = this.criarListaPontosElevador(informacaoPisoOrError, pisoOrError.getValue());
        let elevador = edificioOrError.getValue().returnElevador();
        let listaPontosElevadorFinal = elevador.pontosAtuais().concat(listaPontosElevador);
        elevador.updatePontos(listaPontosElevadorFinal);
        

        // Salas

        let listaSalas = await this.retornarSalasValidas(pisoOrError.getValue(), informacaoPisoOrError);
        if(listaSalas.isFailure){
            return Result.fail<ICarregarMapaDTO>(listaSalas.errorValue());
        }
        for(let sala of listaSalas.getValue()){
            let listaPontosDiagonal = this.criarPontosDiagonalSala(informacaoPisoOrError, sala, pisoOrError.getValue());
            sala.atualizarListaPontos(listaPontosDiagonal);
            let listaPontosSala = this.criarListaPontosSala(informacaoPisoOrError, sala,pisoOrError.getValue());
        }


        // Passagens

        let listaPassagens = await this.retornarPassagensValidadas(pisoOrError.getValue(), informacaoPisoOrError);
        if(listaPassagens.isFailure){
            return Result.fail<ICarregarMapaDTO>(listaPassagens.errorValue());
        }
        
        for(let passagem of listaPassagens.getValue()){
            let listaPontos = this.criarListaPontosPassagem(informacaoPisoOrError, passagem, pisoOrError.getValue());
            passagem.atualizarListaPontos(listaPontos);
        }


        //save
        for(let i = 0; i < pisoOrError.getValue().props.mapa.length; i++){
            for(let j = 0; j < pisoOrError.getValue().props.mapa[i].length; j++){
                await this.pontoRepo.save(pisoOrError.getValue().props.mapa[i][j]);
            }
        }
        this.elevadorRepo.save(elevador);
        for(let sala of listaSalas.getValue()){
            await this.salaRepo.save(sala);
        }
        for(let passagem of listaPassagens.getValue()){
            await this.passagemRepo.save(passagem);
        }
    }

    private verificarSeElevadorValido(edificio : Edificio, piso : Piso, informacaoPiso : any) : boolean{
        if (edificio.temElevador()){
            let elevador = edificio.returnElevador();
            if(elevador.returnDescricao() === informacaoPiso.elevador.descricao &&
            elevador.returnMarca() === informacaoPiso.elevador.marca &&
            elevador.returnModelo() === informacaoPiso.elevador.modelo &&
            elevador.returnNumeroSerie() === informacaoPiso.elevador.numeroSerie){
                return true;
            }
        }else{
            return false;
        }
    }
    
    private async retornarSalasValidas(piso : Piso, informacaoPiso : ICarregarMapaDTO) : Promise<Result<Sala[]>>{
        let listaSala = await this.salaRepo.findSalasByPiso(piso.returnIdPiso());
        let listaSalasValidas : Sala[] = [];
        for(let sala of informacaoPiso.salas){
            let match = false;
            let i = 0;
            do{
                if(sala.nome === listaSala[i].returnNomeSala()){
                    if(sala.descricao !== listaSala[i].returnDescricaoSala() || sala.categoria !== listaSala[i].returnCategoriaSala()){
                        listaSalasValidas.push(listaSala[i]);
                        return Result.fail<Sala[]>("Não existem salas que satisfaçam os dados inseridos");
                    }
                    match = true;
                }
                i++;
            }while(match === false && i < listaSala.length);
            if(match === false){
                return Result.fail<Sala[]>("Não existem salas que satisfaçam os dados inseridos");
            }
        }
        return Result.ok<Sala[]>(listaSala);
    }


    private async retornarPassagensValidadas(piso : Piso, informacaoPiso : ICarregarMapaDTO) : Promise<Result<Passagem[]>>{
        let listaPassagens = await this.passagemRepo.listarPassagensComUmPiso(piso.returnIdPiso());
        let listaPassagensValidas : Passagem[] = [];
        if(listaPassagens.length === 0){
            return Result.fail<Passagem[]>("Não existem passagens que satisfaçam os dados inseridos");
        }
        for(let passagem of informacaoPiso.passagens){
            let match = false;
            let i = 0;
            do{
                if(passagem.id === listaPassagens[i].returnIdPassagem()){
                    listaPassagensValidas.push(listaPassagens[i]);
                    match = true;
                }
                i++;
            }while(match === false && i < listaPassagens.length);
            if(match === false){
                return Result.fail<Passagem[]>("Não existem passagens que satisfaçam os dados inseridos");
            }
        }
        return Result.ok<Passagem[]>(listaPassagensValidas);
    }

    private async verificarSeEdificioExiste(codigoEdificio : string): Promise<Result<Edificio>>{
        let edificioOrError = await this.edifRepo.findByDomainId(codigoEdificio);
        if(edificioOrError === null){
            return Result.fail<Edificio>("O Edifício que inseriu não existe.")
        }
        return Result.ok<Edificio>(edificioOrError);
    }

    private async verificarSePisoExiste(edificio : Edificio, numeroPiso : number): Promise<Result<Piso>> {
        for(let piso of edificio.returnListaPisos()){
            if(piso.returnNumeroPiso() === numeroPiso){
                return Result.ok<Piso>(piso);
            }
        }
        return Result.fail<Piso>("O piso que inseriu não existe.")
    }

    private criarListaPontosElevador(informacaoPiso : ICarregarMapaDTO, piso : Piso) : Ponto[]{
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

    private criarListaPontosPassagem(informacaoPiso : ICarregarMapaDTO, passagem : Passagem, piso : Piso) : Ponto[]{
        let listaPontos : Ponto[] = [];
        let passagemInfo;

        for(let passagemPiso of informacaoPiso.passagens){
            if(passagem.returnIdPassagem() === passagemPiso.id){
                passagemInfo = passagemPiso;
                break;
            }
        }

        listaPontos = piso.returnPontosParaPassagem(passagemInfo.abcissa,passagemInfo.ordenada,passagemInfo.orientacao);
        return listaPontos;
    }

    private criarPontosDiagonalSala(informacaoPiso : ICarregarMapaDTO, sala : Sala, piso : Piso) : Ponto[]{
        let listaPontos : Ponto[] = [];
        let salaInfo;

        for(let salaPiso of informacaoPiso.salas){
            if(sala.returnNomeSala() === salaPiso.nome){
                salaInfo = salaPiso;
                break;
            }
        }
        listaPontos = piso.returnPontosParaDiagonalSala(salaInfo.abcissaA, salaInfo.ordenadaA, salaInfo.abcissaB, salaInfo.ordenadaB);

        listaPontos[0].toParedeNorteOeste();
        listaPontos[1].toVazio();
        return listaPontos;
    }

    private criarListaPontosSala(informacaoPiso : ICarregarMapaDTO, sala : Sala, piso : Piso) : Ponto[]{
        let listaPontos : Ponto[] = [];
        let salaInfo;

        for(let salaPiso of informacaoPiso.salas){
            if(sala.returnNomeSala() === salaPiso.nome){
                salaInfo = salaPiso;
                break;
            }
        }
        listaPontos = piso.returnPontosParaParedesSalas(salaInfo.abcissaA, salaInfo.ordenadaA, salaInfo.abcissaB,
             salaInfo.ordenadaB, salaInfo.abcissaPorta, salaInfo.ordenadaPorta);

        return listaPontos;
    }
}