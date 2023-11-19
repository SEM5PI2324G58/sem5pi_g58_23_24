import { Inject, Service } from "typedi";
import config from "../../../config";
import IMapaRepo from "../IRepos/IMapaRepo";
import IEdificioRepo from "../IRepos/IEdificioRepo";
import ICarregarMapaDTO from "../../dto/ICarregarMapaDTO";
import IExportarMapaDTO from "../../dto/IExportarMapaDTO";
import { Result } from "../../core/logic/Result";
import { Mapa } from "../../domain/mapa/Mapa";
import { TipoPonto } from "../../domain/mapa/TipoPonto";
import { Piso } from "../../domain/piso/Piso";
import ISalaRepo from "../IRepos/ISalaRepo";
import IPassagemRepo from "../IRepos/IPassagemRepo";
import { Edificio } from "../../domain/edificio/Edificio";
import { IdMapa } from "../../domain/mapa/IdMapa";
import IPisoRepo from "../IRepos/IPisoRepo";
import IMapaService from "../IServices/IMapaService";

@Service()
export default class MapaService implements IMapaService{
    constructor(
        @Inject(config.repos.mapa.name) private mapaRepo: IMapaRepo,
        @Inject(config.repos.edificio.name) private ediRepo: IEdificioRepo,
        @Inject(config.repos.sala.name) private salaRepo: ISalaRepo,
        @Inject(config.repos.passagem.name) private passagemRepo: IPassagemRepo,
        @Inject(config.repos.piso.name) private pisoRepo: IPisoRepo,
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
        
        let mapa = piso.props.mapa;
        if(mapa !== null && mapa !== undefined && mapa.verificarSeMapaVazio() === false){
            return Result.fail<ICarregarMapaDTO>("O mapa já tem algo carregado."); // Ainda não implementado.
        }
        let mapaTipoPonto : TipoPonto[][] = [];
        for(let i = 0; i <= edificio.returnDimensaoX(); i++){
            mapaTipoPonto[i] = [];
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

        let elevador = edificio.returnElevador();
        if(elevadorVaiSerCriado){
            if(!edificio.temElevador()){
                return Result.fail<ICarregarMapaDTO>("Não existe elevador neste edifício.");
            }
            if(elevador.returnIdPisosServidos().includes(piso.returnIdPiso()) === false){
                return Result.fail<ICarregarMapaDTO>("O elevador não serve este piso.");
            };
            mapa.criarPontosElevador(mapaDTO.elevador.xCoord, mapaDTO.elevador.yCoord, mapaDTO.elevador.orientacao);
        }
        // Salas
        if(salasVaoSerCriadas){
            if(await this.verificarSalasValidas(piso, mapaDTO) === false){
                return Result.fail<ICarregarMapaDTO>("Não existem salas que satisfaçam os dados inseridos");
            }
            for(let salaInfo of mapaDTO.salas){
                mapa.carregarSalaMapa(salaInfo.nome,salaInfo.abcissaA, salaInfo.ordenadaA, salaInfo.abcissaB,
                    salaInfo.ordenadaB, salaInfo.abcissaPorta, salaInfo.ordenadaPorta, salaInfo.orientacaoPorta);
            }

        }

        // Passagens
        if(passagensVaoSerCriadas){
            if(await this.verificarPassagensValidas(piso, mapaDTO) === false){
                return Result.fail<ICarregarMapaDTO>("Não existem passagens que satisfaçam os dados inseridos");
            }
            
            for(let passagemInfo of mapaDTO.passagens){
                mapa.carregarPassagemMapa(passagemInfo);
            }
        }

        piso.adicionarMapa(mapa);
        //save
        this.mapaRepo.save(mapa);
        this.pisoRepo.save(piso);
        
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

    public async exportarMapa(mapaDTO : IExportarMapaDTO) : Promise<Result<IExportarMapaDTO>>{
        let edificioOrError = await this.verificarSeEdificioExiste(mapaDTO.codigoEdificio);
        if(edificioOrError.isFailure){
            return Result.fail<IExportarMapaDTO>(edificioOrError.errorValue());
        }
        let edificio = edificioOrError.getValue();
        let pisoOrError = await this.verificarSePisoExiste(edificio, mapaDTO.numeroPiso);
        if(pisoOrError.isFailure){
            return Result.fail<IExportarMapaDTO>(pisoOrError.errorValue());
        }
        let piso = pisoOrError.getValue();

        let mapa = piso.props.mapa;

        if(mapa === null || mapa === undefined || mapa.verificarSeMapaVazio() === true){
            return Result.fail<IExportarMapaDTO>("O mapa não tem nada para exportar.");
        }

        let informcaoMapa = mapa.exportarMapa();
        let informacaoMapaDTO : IExportarMapaDTO = {
            texturaChao: "assets/ground.jpg",
            texturaParede: "assets/wall.jpg",
            codigoEdificio: mapaDTO.codigoEdificio,
            numeroPiso : mapaDTO.numeroPiso,
            matriz : informcaoMapa.matriz,
            elevador : informcaoMapa.elevador,
            passagens : informcaoMapa.passagens,
            portas : informcaoMapa.portas,
        }
        return Result.ok<IExportarMapaDTO>(informacaoMapaDTO);
    }
    
}