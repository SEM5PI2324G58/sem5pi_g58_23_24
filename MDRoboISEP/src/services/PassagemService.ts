import { Service, Inject } from 'typedi';
import config from "../../config";
import { Result } from "../core/logic/Result";
import IPassagemRepo from './IRepos/IPassagemRepo';
import IPassagemDTO from '../dto/IPassagemDTO';
import IPassagemService from './IServices/IPassagemService';
import IEdificioRepo from './IRepos/IEdificioRepo';
import { Passagem } from '../domain/passagem/Passagem';
import { IdPassagem } from '../domain/passagem/IdPassagem';
import { Ponto } from '../domain/ponto/Ponto';
import { Piso } from '../domain/piso/Piso';
import IListarPassagemDTO from '../dto/IListarPassagemDTO';
import { PassagemMap } from '../mappers/PassagemMap';
import IListarPassagensPorParDeEdificioDTO from '../dto/IListarPassagensPorParDeEdificioDTO';
@Service()

@Service()
export default class PassagemService implements IPassagemService {

    constructor(
        @Inject(config.repos.passagem.name) private passagemRepo: IPassagemRepo,
        @Inject(config.repos.edificio.name) private edificioRepo: IEdificioRepo,
    ) { }

    public async criarPassagem(passagemDTO: IPassagemDTO): Promise<Result<IPassagemDTO>> {
        try {
            const validacaoResultado = await this.validarDados(passagemDTO);

            if (validacaoResultado.isFailure) {
                return Result.fail<IPassagemDTO>(validacaoResultado.errorValue());
            }

            const {pontoA, pontoB, pontoA1, pontoB1, pisoA, pisoB, id} 
            = validacaoResultado.getValue();

            const listaPontosOrErr = [pontoA, pontoA1, pontoB, pontoB1]

            const passagemOrError = await this.criarObjetoPassagem(listaPontosOrErr, pisoA, pisoB, id);
            if (passagemOrError.isFailure) {
                return Result.fail<IPassagemDTO>(passagemOrError.errorValue());
            }

            let okouErro = await this.salvarDados(passagemOrError.getValue());

            if (okouErro.isFailure) {
                return Result.fail<IPassagemDTO>(okouErro.errorValue());
            }

            return Result.ok<IPassagemDTO>(passagemDTO);
        } catch (e) {
            throw e;
        }
    }

    private async validarDados(passagemDTO: IPassagemDTO): Promise<Result<any>> {

        let passagemDocument = await this.passagemRepo.findByDomainId(passagemDTO.id)

        if(passagemDocument!=null){
            return Result.fail<IPassagemDTO>("A passagem com o id " + passagemDTO.id + " já existe");
        }

        let edificioDocumentA = await this.edificioRepo.findByDomainId(passagemDTO.codigoEdificioA);

        if (edificioDocumentA == null) {
            return Result.fail<IPassagemDTO>("Edificio A não existe");
        }
        if (!edificioDocumentA.verificaSePisoJaExiste(passagemDTO.numeroPisoA)) {
            return Result.fail<IPassagemDTO>("Piso A não existe");
        }

        let edificioDocumentB = await this.edificioRepo.findByDomainId(passagemDTO.codigoEdificioB);

        if (edificioDocumentB == null) {
            return Result.fail<IPassagemDTO>("Edificio B não existe");
        }
        if (!edificioDocumentB.verificaSePisoJaExiste(passagemDTO.numeroPisoB)) {
            return Result.fail<IPassagemDTO>("Piso B não existe");
        }
        const pisoA = edificioDocumentA.returnPisoPeloNumero(passagemDTO.numeroPisoA);
        const pisoB = edificioDocumentB.returnPisoPeloNumero(passagemDTO.numeroPisoB);

        let pontoA : undefined;
        let pontoB : undefined;
        let pontoA1 : undefined;
        let pontoB1 : undefined;

        return Result.ok<any>({
            "pontoA": pontoA,
            "pontoB": pontoB,
            "pontoA1": pontoA1,
            "pontoB1": pontoB1,
            "pisoA": pisoA,
            "pisoB": pisoB,
            "id": passagemDTO.id,
        });
    }

    private async criarObjetoPassagem(listaPontos: Ponto[], pisoA: Piso, pisoB: Piso, id: number): Promise<Result<Passagem>> {
       
        let idPassagemOuErro = await IdPassagem.create(id);

        const passagemOuErro = Passagem.create({
            listaPontos: listaPontos,
            pisoA: pisoA,
            pisoB: pisoB,
        }, idPassagemOuErro.getValue());

        return passagemOuErro;
    }

    private async salvarDados(passagem: Passagem): Promise<Result<void>> {
        
        let passagemOrError = await this.passagemRepo.save(passagem);
        if (passagemOrError==null) {
            return Result.fail<void>("Erro ao salvar passagem");
        }
        return Result.ok<void>();
    }

    
    public async listarPassagensPorParDeEdificios(edificiosDTO: IListarPassagensPorParDeEdificioDTO): Promise<Result<IListarPassagemDTO[]>> {
        try {
            var passagens: Passagem[] = [];

            if (edificiosDTO.edificioACod !== undefined && edificiosDTO.edificioBCod !== undefined) {

                let edificioAPisos = await this.edificioRepo.findByDomainId(edificiosDTO.edificioACod);

                if (edificioAPisos == null) {
                    return Result.fail<IListarPassagemDTO[]>("Edificio A não existe");                    
                }

                let edificioBPisos = await this.edificioRepo.findByDomainId(edificiosDTO.edificioBCod);

                if (edificioBPisos == null) {
                    return Result.fail<IListarPassagemDTO[]>("Edificio B não existe");                    
                }

                let pisosEdificioA = edificioAPisos.returnListaPisos();
                let pisosEdificioB = edificioBPisos.returnListaPisos();

                for (let pisoA of pisosEdificioA) {
                    for (let pisoB of pisosEdificioB) {
                        let passagensTemp = await this.passagemRepo.listarPassagensPorParDePisos(pisoB.returnIdPiso(), pisoA.returnIdPiso());
                        passagens = passagens.concat(passagensTemp);
                    }
                }
            }else{
                passagens = await this.passagemRepo.findAll();
            }

            if (passagens.length === 0) {
                return Result.fail<IListarPassagemDTO[]>("Não existem passagens que satisfaçam os parâmetros de pesquisa");
            }

            const passagensDTO: IListarPassagemDTO[] = [];
            
            for (let passagem of passagens) {
                passagensDTO.push(PassagemMap.toListarPassagemDTO(passagem));
            }

            return Result.ok<IListarPassagemDTO[]>(passagensDTO);
        } catch (e) {
            throw e;
        }
    }
    
}
