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
import PisoRepo from '../repos/PontoRepo';
import IPisoRepo from './IRepos/IPisoRepo';

@Service()

export default class PassagemService implements IPassagemService {
    constructor(
        @Inject(config.repos.passagem.name) private passagemRepo: IPassagemRepo,
        @Inject(config.repos.piso.name) private edificioRepo: IEdificioRepo,
        @Inject(config.repos.piso.name) private pontoRepo: IPontoRepo,
        @Inject(config.repos.piso.name) private pisoRepo: IPisoRepo,

    ) { }

    public async criarPassagem(passagemDTO: IPassagemDTO): Promise<Result<IPassagemDTO>> {
        try {
            const passagemDocument = await this.passagemRepo.findByDomainId(passagemDTO.id);
            let found = !!passagemDocument;
            if (found) {
                return Result.fail<IPassagemDTO>("A passagem com o id " + passagemDTO.id + " já existe");
            }

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

            let pontoA = edificioDocumentA.getPonto(passagemDTO.abcissaA, passagemDTO.ordenadaA, passagemDTO.idPisoA);
            if (pontoA == null || pontoA == undefined) {
                return Result.fail<IPassagemDTO>("Não existem pontos na posição A");
            }
            let pontoB = edificioDocumentB.getPonto(passagemDTO.abcissaB, passagemDTO.ordenadaB, passagemDTO.idPisoB);
            if (pontoB == null || pontoB == undefined) {
                return Result.fail<IPassagemDTO>("Não existem pontos na posição B");
            }

            edificioDocumentA.verificarPisoExiste(passagemDTO.idPisoA);
            edificioDocumentA.existePontoNoLimite(passagemDTO.idPisoA, pontoA);
            edificioDocumentB.verificarPisoExiste(passagemDTO.idPisoB);
            edificioDocumentB.existePontoNoLimite(passagemDTO.idPisoA, pontoB);

            const listaPontosOrErr = [pontoA, pontoA, pontoB, pontoB]; //TODO: corrigir isto para obter os ponto seguinte ao pontoA e pontoB

            let maxId = await this.passagemRepo.getMaxId();
            maxId++;
            const idPassagemOuErro = IdPassagem.create(maxId);
            const pisoA = await this.pisoRepo.findByDomainId(Number(passagemDTO.idPisoA));
            const pisoB = await this.pisoRepo.findByDomainId(Number(passagemDTO.idPisoB));

            const passagemOrError = Passagem.create({
                listaPontos: listaPontosOrErr,
                pisoA: pisoA,
                pisoB: pisoB
            }, idPassagemOuErro.getValue());

            if (passagemOrError.isFailure) {
                return Result.fail<IPassagemDTO>(passagemOrError.errorValue());
            }

            edificioDocumentA.alterarPontosPorPassagem(pontoA, pisoA.returnIdPiso().toString());
            edificioDocumentB.alterarPontosPorPassagem(pontoB, pisoB.returnIdPiso().toString());

            await this.passagemRepo.save(passagemOrError.getValue());
            await this.edificioRepo.save(edificioDocumentA);
            await this.edificioRepo.save(edificioDocumentB);

            return Result.ok<IPassagemDTO>(passagemDTO);
        } catch (e) {
            throw e;
        }
    }
}