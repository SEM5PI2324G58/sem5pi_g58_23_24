import { Service, Inject } from 'typedi';
import config from "../../../config";
import { Result } from "../../core/logic/Result";
import IEdificioRepo from '../IRepos/IEdificioRepo';
import IEdificioService from '../IServices/IEdificioService';
import IEdificioDTO from '../../dto/IEdificioDTO';
import { Edificio } from '../../domain/edificio/Edificio';
import { Nome } from '../../domain/edificio/Nome';
import { Codigo } from '../../domain/edificio/Codigo';
import { Dimensao } from '../../domain/edificio/Dimensao';
import { Piso } from '../../domain/piso/Piso';
import IListarEdMinEMaxPisosDTO from '../../dto/IListarEdMinEMaxPisosDTO';
import { EdificioMap } from '../../mappers/EdificioMap';
import { DescricaoEdificio } from '../../domain/edificio/DescricaoEdificio';
import IPisoRepo from '../IRepos/IPisoRepo';
import IElevadorRepo from '../IRepos/IElevadorRepo';
import ISalaRepo from '../IRepos/ISalaRepo';
import IPassagemRepo from '../IRepos/IPassagemRepo';
import IMapaRepo from '../IRepos/IMapaRepo';

@Service()
export default class EdificioService implements IEdificioService {
  constructor(
      @Inject(config.repos.edificio.name) private edificioRepo : IEdificioRepo,
      @Inject(config.repos.piso.name) private  pisoRepo: IPisoRepo,
      @Inject(config.repos.elevador.name) private elevadorRepo : IElevadorRepo,
      @Inject(config.repos.sala.name) private salaRepo : ISalaRepo,
      @Inject(config.repos.passagem.name) private passagemRepo : IPassagemRepo,
      @Inject(config.repos.mapa.name) private mapaRepo : IMapaRepo
  ) {}

  public async criarEdificio(edificioDTO: IEdificioDTO): Promise<Result<IEdificioDTO>> {
      try{
        const edificioDocument = await this.edificioRepo.findByDomainId(edificioDTO.codigo);
        if(edificioDocument !== null ){
          return Result.fail<IEdificioDTO>("Edificio já existe")
        }else{
          let codigoOrError = Codigo.create(edificioDTO.codigo);
          let dimensaoOrError = Dimensao.create(edificioDTO.dimensaoX,edificioDTO.dimensaoY);
          if(codigoOrError.isFailure){                                        //verificar se o codigo e a dimensão são válidos
            return Result.fail<IEdificioDTO>(codigoOrError.errorValue());
          }else if(dimensaoOrError.isFailure){
            return Result.fail<IEdificioDTO>(dimensaoOrError.errorValue());
          }
          let listaPisos: Piso[] = [];                                            
          let dadosEdificio : any = {
            dimensao:dimensaoOrError.getValue(),                         //adicionar os dados do edificio obrigatórios           
            listaPisos:listaPisos,
          }
          if(edificioDTO.nome){                                         // verifcar se os dados opcionais existem e estão corretos
            let nomeOrError = Nome.create(edificioDTO.nome);            // e adiciona-os se estiverem
            if(nomeOrError.isSuccess){
              dadosEdificio.nome = nomeOrError.getValue();
            }else{
              return Result.fail<IEdificioDTO>(nomeOrError.errorValue());
            }
          }
          if(edificioDTO.descricao){
            let descricaoOrError = DescricaoEdificio.create(edificioDTO.descricao);
            if(descricaoOrError.isSuccess){
              dadosEdificio.descricao = descricaoOrError.getValue();
            }else{
              return Result.fail<IEdificioDTO>(descricaoOrError.errorValue());
            }
          }
          const edificioOrError = Edificio.create(dadosEdificio,codigoOrError.getValue());  //criar o edificio
  
          if (edificioOrError.isFailure) {
              return Result.fail<IEdificioDTO>(edificioOrError.errorValue()); //verificar se o edificio foi criado com sucesso  
          }
          const edificio = edificioOrError.getValue();
          await this.edificioRepo.save(edificio);                            //dar save ao edificio
          return Result.ok<IEdificioDTO>( edificioDTO)
        }
      }catch(e){
        throw e;
      }
  }
  public async listarEdificioMinEMaxPisos(listarEdificioMinEMaxPisosDTO: IListarEdMinEMaxPisosDTO): Promise<Result<IEdificioDTO[]>> {
    try{

      if(listarEdificioMinEMaxPisosDTO.minPisos > listarEdificioMinEMaxPisosDTO.maxPisos){
        return Result.fail<IEdificioDTO[]>("O número mínimo de pisos não pode ser superior ao máximo");
      }else if(listarEdificioMinEMaxPisosDTO.minPisos < 0 || listarEdificioMinEMaxPisosDTO.maxPisos < 0){
        return Result.fail<IEdificioDTO[]>("O número mínimo e máximo de pisos não pode ser inferior a 0");
      }else if(listarEdificioMinEMaxPisosDTO.minPisos === 0 && listarEdificioMinEMaxPisosDTO.maxPisos === 0){
        return Result.fail<IEdificioDTO[]>("O número mínimo e máximo de pisos não pode ser 0");
      }


      const edificioDocument = await this.edificioRepo.getAllEdificios();
      let listaEdificiosDTO: IEdificioDTO[] = [];
      for (let edificio of edificioDocument) {
        if(edificio.verificaSeONumeroDePisosEstaDentroDosLimites(listarEdificioMinEMaxPisosDTO.minPisos,listarEdificioMinEMaxPisosDTO.maxPisos)){
          listaEdificiosDTO.push(EdificioMap.toDTO(edificio));
        }
      }
      if(listaEdificiosDTO.length > 0){
        return Result.ok<IEdificioDTO[]>(listaEdificiosDTO);
      }
    }catch(e){
      throw e;
    }

    return Result.fail<IEdificioDTO[]>("Não existem edificios com o número de pisos pretendido");
  }

  public async listarEdificios(): Promise<Result<IEdificioDTO[]>>{
    try{
      const edificioDocument = await this.edificioRepo.getAllEdificios();
      let listaEdificiosDTO: IEdificioDTO[] = [];
      if(edificioDocument.length === 0){
        return Result.fail<IEdificioDTO[]>("Não existem edificios");
      }
      for (let edificio of edificioDocument) {
        listaEdificiosDTO.push(EdificioMap.toDTO(edificio));
      }
      return Result.ok<IEdificioDTO[]>(listaEdificiosDTO);
    }catch(e){
      throw e;
    }
  }

  public async editarEdificio(edificioDTO:IEdificioDTO): Promise<Result<IEdificioDTO>>{                                                                                                                                                                                                                                                          
    try{
      const edificio = await this.edificioRepo.findByDomainId(edificioDTO.codigo);
      if(edificio === null ){
        return Result.fail<IEdificioDTO>("Edificio não existe")
      }
      if(!!edificioDTO.descricao === false && !!edificioDTO.nome === false){
        return Result.fail<IEdificioDTO>("É necessário pelo menos um dos campos para editar o edificio");
      }
      if(edificioDTO.descricao){
        let descricaoOrError = DescricaoEdificio.create(edificioDTO.descricao);
        if(descricaoOrError.isFailure){
          return Result.fail<IEdificioDTO>(descricaoOrError.errorValue());
        }else{
          edificio.alterarDescricao(descricaoOrError.getValue());
        }
      }
      if(edificioDTO.nome){
        let nomeOrError = Nome.create(edificioDTO.nome);
        if(nomeOrError.isFailure){
          return Result.fail<IEdificioDTO>(nomeOrError.errorValue());
        }else{
          edificio.alterarNome(nomeOrError.getValue());
        }
      }
      await this.edificioRepo.save(edificio);
      return Result.ok<IEdificioDTO>(edificioDTO);
    }catch(e){
      throw e;
    }
  }

  public async deleteEdificio(codigo: string): Promise<Result<IEdificioDTO>>{
    
    const edificio = await this.edificioRepo.findByDomainId(codigo);
    if(edificio === null ){
      return Result.fail<IEdificioDTO>("Edificio não existe")
    }
    await this.edificioRepo.delete(edificio);
    let elevador = edificio.returnElevador();
    if(elevador){
      await this.elevadorRepo.delete(elevador);
    }
    let listaPisos = edificio.returnListaPisos();
    for(let pisos of listaPisos){
      let listaSalas = await this.salaRepo.findSalasByPiso(pisos.returnIdPiso());
      for (let sala of listaSalas) {
        await this.salaRepo.delete(await sala);
      }
      let listaPassagens = await this.passagemRepo.listarPassagensComUmPiso(pisos.returnIdPiso());
      for (let passagem of listaPassagens) {
        await this.passagemRepo.delete(await passagem);
      }
      if(pisos.props.mapa !== undefined && pisos.props.mapa !== null){
        await this.mapaRepo.delete(pisos.props.mapa);
      }
      await this.pisoRepo.delete(pisos);
    }
    return Result.ok<IEdificioDTO>(EdificioMap.toDTO(edificio));
  }
}
