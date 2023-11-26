import { Container, Service, Inject } from 'typedi';
import config from '../../../config';

import { Result } from "../../core/logic/Result";
import IPisoService from '../IServices/IPisoService';
import IPisoDTO from '../../dto/IPisoDTO';
import { PisoMap } from '../../mappers/PisoMap';
import ISalaRepo from '../IRepos/ISalaRepo';
import IEdificioService from '../IServices/IEdificioService';
import IPlaneamentoService from '../IServices/IPlaneamentoService';
import ICoordenadasPontosDTO from '../../dto/ICoordenadasPontosDTO';
import IEdificioRepo from '../IRepos/IEdificioRepo';
import e from 'express';


@Service()
export default class PlaneamentoService implements IPlaneamentoService {
    constructor(
        @Inject(config.repos.sala.name) private salaRepoInstance : ISalaRepo,
        @Inject(config.services.edificio.name) private edificioServiceInstance : IEdificioService,
        @Inject(config.repos.edificio.name) private edificioRepoInstance : IEdificioRepo
    ) { }

    public async encontrarCaminhosEntreEdificios(salaInicial: string, salaFinal: string): Promise<Result<String>> {
        try {
            const salaI = await this.salaRepoInstance.findByDomainId(salaInicial);
            let flag = !!salaI;
            if (!flag) {
                return Result.fail<String>("A sala com o nome" + salaInicial + " não existe");
            }
            const salaF = await this.salaRepoInstance.findByDomainId(salaFinal);
            flag = !!salaF;
            if (!flag) {
                return Result.fail<String>("A sala com o nome" + salaFinal + " não existe");
            }
            let edificioI = await this.edificioRepoInstance.findByPiso(salaI.props.piso.returnIdPiso());
            flag = !!salaF;
            if (!flag) {
                return Result.fail<String>("O edificio com o piso" + salaI.props.piso.returnIdPiso() + " não existe");
            }
            let edificioF = await this.edificioRepoInstance.findByPiso(salaF.props.piso.returnIdPiso());
            flag = !!salaF;
            if (!flag) {
                return Result.fail<String>("O edificio com o piso" + salaF.props.piso.returnIdPiso() + " não existe");
            }
            
            if(!salaI.props.piso.hasMapa()){
                return Result.fail<String>("O piso da sala inicial não tem mapa");
            };
            if(!salaF.props.piso.hasMapa()){
                return Result.fail<String>("O piso da sala final não tem mapa");
            };
            let coordenadasSalaI;
            let coordenadasSalaF;
            let salasMapa = salaI.props.piso.props.mapa.props.coordenadasSala;
            for(let i = 0; i < salasMapa.length; i++){
                if(salasMapa[i].returnNome() == salaInicial){
                    coordenadasSalaI = salasMapa[i];
                }
            }
            salasMapa = salaF.props.piso.props.mapa.props.coordenadasSala;
            for(let i = 0; i < salasMapa.length; i++){
                if(salasMapa[i].returnNome() == salaFinal){
                    coordenadasSalaF = salasMapa[i];
                }
            }


            let ICoordenadasPontosDTO = {
                x_origem: coordenadasSalaI.returnAbcissaPorta(),
                y_origem: coordenadasSalaI.returnOrdenadaPorta(),
                piso_origem: edificioI.returnEdificioId() + salaI.props.piso.returnIdPiso(),
                x_destino: coordenadasSalaF.returnAbcissaPorta(),
                y_destino: coordenadasSalaF.returnOrdenadaPorta(),
                piso_destino: edificioF.returnEdificioId() + salaF.props.piso.returnIdPiso(),
            } as ICoordenadasPontosDTO;
            
            let answer = await this.edificioServiceInstance.getInformacaoPlaneamento(ICoordenadasPontosDTO);
            if(answer.isFailure){
                return Result.fail<String>("Não foi possível encontrar um caminho entre as salas");
            }
            return Result.ok<String>(answer.getValue().caminho);
        }
        catch (e) {
            throw e;
        }

    }
}    