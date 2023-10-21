import { Service, Inject } from 'typedi';
import config from "../../config";
import { Result } from "../core/logic/Result";
import IEdificioRepo from './IRepos/IEdificioRepo';
import IEdificioService from './IServices/IEdificioService';
import IEdificioDTO from '../dto/IEdificioDTO';
import { Edificio } from '../domain/edificio/Edificio';

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
            const edificioOrError = Edificio.create(edificioDTO.nome,edificioDTO.dimensaoX, edificioDTO.dimensaoY, edificioDTO.descricao,edificioDTO.codigo);
    
            if (edificioOrError.isFailure) {
                return Result.fail<IEdificioDTO>(edificioOrError.errorValue());
            }
            const edificio = edificioOrError.getValue();
            await this.edificioRepo.save(edificio);
            return Result.ok<IEdificioDTO>( edificioDTO)
        }
      }catch(e){
        throw e;
      }
  }
}
