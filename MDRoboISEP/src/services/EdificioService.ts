import { Service, Inject } from 'typedi';
import config from "../../config";
import { Result } from "../core/logic/Result";
import IEdificioRepo from './IRepos/IEdificioRepo';
import IEdificioService from './IServices/IEdificioService';
import IEdificioDTO from '../dto/IEdificioDTO';
import { Edificio } from '../domain/edificio/Edificio';
import { Nome } from '../domain/edificio/Nome';
import { Codigo } from '../domain/edificio/Codigo';
import { Dimensao } from '../domain/edificio/Dimensao';
import { Piso } from '../domain/piso/Piso';

@Service()

export default class EdificioService implements IEdificioService {
  constructor(
      @Inject(config.repos.edificio.name) private edificioRepo : IEdificioRepo
  ) {}

  public async criarEdificio(edificioDTO: IEdificioDTO): Promise<Result<IEdificioDTO>> {
      try{
        if(this.edificioRepo.findByDomainId(edificioDTO.codigo) != null ){
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
            let descricaoOrError = Nome.create(edificioDTO.descricao);
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
}
