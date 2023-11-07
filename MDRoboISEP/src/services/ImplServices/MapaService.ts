import { Inject } from "typedi";
import config from "../../../config";
import IMapaRepo from "../IRepos/IMapaRepo";
import IEdificioRepo from "../IRepos/IEdificioRepo";
import ICarregarMapaDTO from "../../dto/ICarregarMapaDTO";
import { Result } from "../../core/logic/Result";
import { Mapa } from "../../domain/mapa/Mapa";
import { TipoPonto } from "../../domain/mapa/TipoPonto";
import { Elevador } from "../../domain/elevador/Elevador";
import { Piso } from "../../domain/piso/Piso";
import ISalaRepo from "../IRepos/ISalaRepo";
import { Sala } from "../../domain/sala/Sala";
import IPassagemRepo from "../IRepos/IPassagemRepo";
import { Edificio } from "../../domain/edificio/Edificio";
import { IdMapa } from "../../domain/mapa/IdMapa";

export default class MapaService implements MapaService{
    constructor(
        @Inject(config.repos.mapa.name) private mapaRepo: IMapaRepo,
        @Inject(config.repos.edificio.name) private ediRepo: IEdificioRepo,
        @Inject(config.repos.sala.name) private salaRepo: ISalaRepo,
        @Inject(config.repos.passagem.name) private passagemRepo: IPassagemRepo,
    ){}

    public async carregarMapa(mapaDTO : ICarregarMapaDTO) : Promise<Result<ICarregarMapaDTO>>{
        const edificioOrError = await this.verificarSeEdificioExiste(mapaDTO.codigoEdificio);
        if(edificioOrError.isFailure){
            return Result.fail<ICarregarMapaDTO>(edificioOrError.errorValue());
        }
        let edificio = edificioOrError.getValue();
        const pisoOrError = await this.verificarSePisoExiste(edificioOrError.getValue(), mapaDTO.numeroPiso);    
        if(pisoOrError.isFailure){
            return Result.fail<ICarregarMapaDTO>(pisoOrError.errorValue());
        }
        let piso = pisoOrError.getValue();
        
        let mapa; // Alterar para Mapa
        if(mapa !== null && mapa !== undefined && mapa.verificarSeMapaVazio() === false){
            return Result.fail<ICarregarMapaDTO>("O mapa já tem algo carregado."); // Ainda não implementado.
        }
        let mapaTipoPonto : TipoPonto[][] = [];
        for(let i = 0; i <= edificio.returnDimensaoX(); i++){
            for(let j = 0; j <= edificio.returnDimensaoY(); j++){
                mapaTipoPonto[i][j] = TipoPonto.create(" ").getValue();
            }
        }
        mapa = Mapa.create({mapa:mapaTipoPonto}, IdMapa.create(await this.mapaRepo.getMaxId() + 1).getValue()).getValue();
        mapa.carregarMapaComBermas();
    
        // Elevador

        let elevadorVaiSerCriado = true;
        if(mapaDTO.elevador === undefined){
            elevadorVaiSerCriado = false;
        }
        let salasVaoSerCriadas = true;
        if(mapaDTO.salas === undefined){
            salasVaoSerCriadas = false;
        }
        let passagensVaoSerCriadas = true;
        if(mapaDTO.passagens === undefined){
            passagensVaoSerCriadas = false;
        }

        if(!elevadorVaiSerCriado && !salasVaoSerCriadas && !passagensVaoSerCriadas){
            return Result.fail<ICarregarMapaDTO>("Não existe nada para carregar no mapa.");
        }

        let elevador : Elevador;
        if(elevadorVaiSerCriado){
            if(!edificio.temElevador()){
                return Result.fail<ICarregarMapaDTO>("Não existe elevador neste edifício.");
            }
            if(!edificio.returnListaPisosId().includes(piso.returnIdPiso())){
                return Result.fail<ICarregarMapaDTO>("O elevador não serve este piso.");
            };
            elevador = edificio.returnElevador();
            mapa.criarPontosElevador(mapaDTO.elevador.xCoord, mapaDTO.elevador.yCoord, mapaDTO.elevador.orientacao);
        }
        // Salas
        if(salasVaoSerCriadas){
            if(await this.verificarSalasValidas(piso, mapaDTO) === false){
                Result.fail<ICarregarMapaDTO>("Não existem salas que satisfaçam os dados inseridos");
            }
            for(let salaInfo of mapaDTO.salas){
                mapa.carregarSalaMapa(salaInfo.abcissaA, salaInfo.ordenadaA, salaInfo.abcissaB,
                    salaInfo.ordenadaB, salaInfo.abcissaPorta, salaInfo.ordenadaPorta);
            }

        }

        // Passagens
        if(passagensVaoSerCriadas){
            if(await this.verificarPassagensValidas(piso, mapaDTO)){
                return Result.fail<ICarregarMapaDTO>("Não existem passagens que satisfaçam os dados inseridos");
            }
            
            for(let passagemInfo of mapaDTO.passagens){
                mapa.carregarPassagemMapa(passagemInfo);
            }
        }


        //save
        this.mapaRepo.save(mapa);
        
        return Result.ok<ICarregarMapaDTO>(mapaDTO);
    }





    private async verificarSalasValidas(piso : Piso, mapaDTO : ICarregarMapaDTO) : Promise<boolean>{
        let listaSala = await this.salaRepo.findSalasByPiso(piso.returnIdPiso());
        if(listaSala.length === 0){
            return false
        }
        for(let sala of mapaDTO.salas){
            let match = false;
            let i = 0;
            do{
                if(sala.nome === listaSala[i].returnNomeSala()){
                    match = true;
                }
                i++;
            }while(match === false && i < listaSala.length);
            if(match === false){
                return false
            }
        }
        return true;
    }


    private async verificarPassagensValidas(piso : Piso, mapaDTO : ICarregarMapaDTO) : Promise<boolean>{
        let listaPassagens = await this.passagemRepo.listarPassagensComUmPiso(piso.returnIdPiso());
        if(listaPassagens.length === 0){
            return false;
        }
        for(let passagem of mapaDTO.passagens){
            let match = false;
            let i = 0;
            do{
                if(passagem.id === listaPassagens[i].returnIdPassagem()){
                    match = true;
                }
                i++;
            }while(match === false && i < listaPassagens.length);
            if(match === false){
                return false;
            }
        }
        return true;
    }

    private async verificarSeEdificioExiste(codigoEdificio : string): Promise<Result<Edificio>>{
        let edificioOrError = await this.ediRepo.findByDomainId(codigoEdificio);
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

}