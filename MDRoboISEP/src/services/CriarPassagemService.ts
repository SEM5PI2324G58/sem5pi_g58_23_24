import { Service, Inject } from 'typedi';
import config from "../../config";
import { Result } from "../core/logic/Result";
import IPassagemRepo from '../services/IRepos/IPassagemRepo';
import IPassagemDTO from '../dto/IPassagemDTO';
import IPassagemService from '../services/IServices/IPassagemService';
import IEdificioRepo from '../services/IRepos/IEdificioRepo';
import { Passagem } from '../domain/passagem/Passagem';
import IPontoRepo from '../services/IRepos/IPontoRepo';
import { IdPassagem } from '../domain/passagem/IdPassagem';

@Service()

export default class PassagemService implements IPassagemService {
    constructor(
        @Inject(config.repos.passagem.name) private passagemRepo: IPassagemRepo,
        @Inject(config.repos.piso.name) private edificioRepo: IEdificioRepo,
        @Inject(config.repos.piso.name) private pontoRepo: IPontoRepo,

    ) { }

    public async criarPassagem(passagemDTO: IPassagemDTO): Promise<Result<IPassagemDTO>> {
        try {
            const passagemDocument = await this.passagemRepo.findByDomainId(passagemDTO.id);
            let found = !!passagemDocument;
            if (found) {
                return Result.fail<IPassagemDTO>("A passagem com o id " + passagemDTO.id + " já existe");
            }
         
            let pontos = passagemDTO.listaPontos;

            if (passagemDTO.idEdificioA == passagemDTO.idEdificioB) {
                return Result.fail<IPassagemDTO>("Os edificios são iguais");
            }

            const edificioDocumentA = await this.edificioRepo.findByDomainId(passagemDTO.idEdificioA);
            found = !!edificioDocumentA;
            if (!found) {
                return Result.fail<IPassagemDTO>("O edificio com o id " + passagemDTO.idEdificioA + " não existe");
            }
            const edificioDocumentB = await this.edificioRepo.findByDomainId(passagemDTO.idEdificioB);
            found = !!edificioDocumentB;
            if (!found) {
                return Result.fail<IPassagemDTO>("O edificio com o id " + passagemDTO.idEdificioB + " não existe");
            }
        
            edificioDocumentA.verificarPisoExiste(passagemDTO.idPisoA);
            edificioDocumentA.verificarPontoExiste(passagemDTO.idPisoA, passagemDTO.idPisoB, pontos);
            edificioDocumentB.verificarPisoExiste(passagemDTO.idPisoB);
            edificioDocumentB.verificarPontoExiste(passagemDTO.idPisoA, passagemDTO.idPisoB, pontos);

            const listaPontosOrErr = [];
            for (let index = 0; index < pontos.length; index++) {
                const ponto = pontos[index];
                listaPontosOrErr.push(await this.pontoRepo.findByDomainId(ponto.id));
            }

            let maxId = await this.passagemRepo.getMaxId();
            maxId++;
            const idPassagemOuErro = await IdPassagem.create(maxId);

            const passagemOurErro = await Passagem.create({
                listaPontos: listaPontosOrErr,
            }, idPassagemOuErro.getValue());

            if (passagemOurErro.isFailure) {
                return Result.fail<IPassagemDTO>(passagemOurErro.errorValue());
            }
            
            return Result.ok<IPassagemDTO>(passagemDTO);
        } catch (e) {
            throw e;
        }
    }
}