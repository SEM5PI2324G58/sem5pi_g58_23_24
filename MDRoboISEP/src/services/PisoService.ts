import { Container, Service, Inject } from 'typedi';

import jwt from 'jsonwebtoken';
import config from '../../config';
import argon2 from 'argon2';
import { randomBytes } from 'crypto';


import { UserMap } from "../mappers/UserMap";
import { IUserDTO } from '../dto/IUserDTO';

import IEdificioRepo from './IRepos/IEdificioRepo';
import IPisoRepo from './IRepos/IPisoRepo';
import IPontoRepo from './IRepos/IPontoRepo';
import ICriarPisoDTO from '../dto/ICriarPisoDTO';
import { Piso } from '../domain/piso/Piso';
import { NumeroPiso } from '../domain/piso/NumeroPiso';
import { DescricaoPiso } from '../domain/piso/DescricaoPiso';
import { IdPiso } from '../domain/piso/IdPiso';
import { Ponto } from '../domain/ponto/Ponto';
import { Coordenadas } from '../domain/ponto/Coordenadas';
import { TipoPonto } from '../domain/ponto/TipoPonto';
import { IdPonto } from '../domain/ponto/IdPonto';

import { Role } from '../domain/role';

import { Result } from "../core/logic/Result";
import IPisoService from './IServices/IPisoService';



@Service()
export default class PisoService implements IPisoService{
  constructor(
      @Inject(config.repos.piso.name) private pisoRepo : IPisoRepo,
      @Inject(config.repos.edificio.name) private edifRepo : IEdificioRepo,
      @Inject(config.repos.ponto.name) private pontoRepo : IPontoRepo,
      @Inject('logger') private logger,
  ) {}


  public async criarPiso(criarPisoDTO: ICriarPisoDTO): Promise<Result<{criarPisoDTO: ICriarPisoDTO}>> {
    try {
        const edifDocument = await this.edifRepo.findByDomainId(criarPisoDTO.codigo);
        let found = !!edifDocument;
        if(!found){
            Result.fail<{criarPisoDTO: ICriarPisoDTO}>("O edificio com o código " + criarPisoDTO.codigo +" não existe");
        }
        
        let pisos = edifDocument.props.listaPisos;

        found = false;
        for (let i = 0; i < pisos.length; i++) {
            if(pisos[i].returnNumeroPiso() === criarPisoDTO.numeroPiso){
                found = true;
            }
        }
        if(found){
            Result.fail<{criarPisoDTO: ICriarPisoDTO}>("O piso numero " + criarPisoDTO.numeroPiso +" já existe");
        }

        let maxId = await this.pisoRepo.getMaxId();
        
        const numeroPisoOuErro = await NumeroPiso.create(criarPisoDTO.numeroPiso);
        const idPisoOuErro = await IdPiso.create(maxId + 1);

        let descricaoOuErro;
        let finalResult;
        if(criarPisoDTO.descricaoPiso.length == 0 || criarPisoDTO.descricaoPiso == null || criarPisoDTO.descricaoPiso == undefined){
            descricaoOuErro = null;
            finalResult = Result.combine([numeroPisoOuErro,idPisoOuErro]) ;
        }else{
            descricaoOuErro = await DescricaoPiso.create(criarPisoDTO.descricaoPiso);
            finalResult = Result.combine([numeroPisoOuErro,idPisoOuErro,descricaoOuErro]) ;
        }

        if (finalResult.isFailure) {
            return Result.fail<{criarPisoDTO: ICriarPisoDTO}>(finalResult.error);
        }
        
        let ponto : Ponto[][] = [];
        let x = edifDocument.props.dimensao.props.x;
        let y = edifDocument.props.dimensao.props.y;
        let contador = 1;
        for (let i = 0; i <= x; i++) {
            ponto[i] = [];
            for (let j = 0; j <= y ; j++) {
                let tipoPonto;
                if(i == 0 && j ==0 ) {tipoPonto = TipoPonto.create("NorteOeste").getValue();}
                else if((1 <= i && i < x && (j == 0 || j == y)) || (i == 0 && j == y)) {tipoPonto = TipoPonto.create("Norte").getValue();}
                else if((1 <= j && j < y && (i == 0 || i == x)) || (i == x && j == 0)) {tipoPonto = TipoPonto.create("Oeste").getValue();}
                else{tipoPonto = TipoPonto.create("").getValue();}
                let pontoOuErro = await Ponto.create({
                coordenadas : Coordenadas.create({abscissa: x , ordenada: y }).getValue(),
                tipoPonto: tipoPonto
                }, await IdPonto.create(criarPisoDTO.codigo + "." + criarPisoDTO.numeroPiso + "." + contador).getValue());
                contador++;
                if(pontoOuErro.isFailure){return Result.fail<{criarPisoDTO: ICriarPisoDTO}>(finalResult.error);}
                ponto[i][j] = pontoOuErro.getValue();
            }
        }  


        const pisoOuErro = await Piso.create({
            numeroPiso: numeroPisoOuErro.getValue(),
            descricaoPiso: descricaoOuErro.getValue(),
            mapa: ponto,
        }, idPisoOuErro.getValue());

        if (pisoOuErro.isFailure) {
            throw Result.fail<ICriarPisoDTO>(pisoOuErro.errorValue());
        }

        edifDocument.addPiso(pisoOuErro.getValue());

        for (let i = 0; i <= x; i++) {
            for (let j = 0; j <= y ; j++) {
                this.pontoRepo.save(ponto[i][j]);
            }
        }  


        await this.pisoRepo.save(pisoOuErro.getValue());
        
        await this.edifRepo.save(edifDocument);

        return Result.ok<{criarPisoDTO: ICriarPisoDTO}>( {criarPisoDTO: criarPisoDTO} );
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

}
