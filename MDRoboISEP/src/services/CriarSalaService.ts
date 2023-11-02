import { Service, Inject } from 'typedi';
import config from "../../config";
import { Result } from "../core/logic/Result";
import ISalaDTO from '../dto/ISalaDTO';
import ISalaService from '../services/IServices/ISalaService';
import IEdificioRepo from '../services/IRepos/IEdificioRepo';
import IPontoRepo from '../services/IRepos/IPontoRepo';
import IPisoRepo from './IRepos/IPisoRepo';
import ISalaRepo from './IRepos/ISalaRepo';
import { Edificio } from '../domain/edificio/Edificio';
import { Ponto } from '../domain/ponto/Ponto';
import IdSala from '../domain/sala/IdSala';
import { Sala } from '../domain/sala/Sala';
import CategorizacaoSala from '../domain/sala/CategorizacaoSala';
import DescricaoSala from '../domain/sala/DescricaoSala';
import { Piso } from '../domain/piso/Piso';

@Service()

@Service()
export default class SalaService implements ISalaService {

    constructor(
        @Inject(config.repos.piso.name) private edificioRepo: IEdificioRepo,
        @Inject(config.repos.piso.name) private pisoRepo: IPisoRepo,
        @Inject(config.repos.ponto.name) private pontoRepo: IPontoRepo,
        @Inject(config.repos.sala.name) private salaRepo: ISalaRepo,
    ) { }

    public async criarSala(salaDTO: ISalaDTO): Promise<Result<ISalaDTO>> {
        try {
            const validacaoResultado = await this.validarDados(salaDTO);

            if (validacaoResultado.isFailure) {
                return Result.fail<ISalaDTO>(validacaoResultado.errorValue());
            }

            const { edificio, pontoA, pontoB, piso }
                = validacaoResultado.getValue();

            const listaPontosOrErr = [pontoA, pontoB]

            const salaOrError = await this.criarObjetoSala(listaPontosOrErr, salaDTO.categoria, salaDTO.descricao);
            if (salaOrError.isFailure) {
                return Result.fail<ISalaDTO>(salaOrError.errorValue());
            }

            let okouErro = await this.salvarDados(salaOrError.getValue(),
                edificio, pontoA, pontoB, piso);

            if (okouErro.isFailure) {
                return Result.fail<ISalaDTO>(okouErro.errorValue());
            }

            return Result.ok<ISalaDTO>(salaDTO);
        } catch (e) {
            throw e;
        }
    }
    async salvarDados(sala: Sala, edificio: Edificio, pontoA: Ponto, pontoB: Ponto, piso: Piso): Promise<Result<void>> {
        let salaOrError = await this.salaRepo.save(sala);
        if (salaOrError == null) {
            return Result.fail<void>("Erro ao salvar passagem");
        }
        let pontoOrError = await this.pontoRepo.save(pontoA);
        if (pontoOrError == null) {
            return Result.fail<void>("Erro ao salvar ponto A");
        }
        pontoOrError = await this.pontoRepo.save(pontoB);
        if (pontoOrError == null) {
            return Result.fail<void>("Erro ao salvar ponto B");
        }
        let edificioOrError = await this.edificioRepo.save(edificio);
        if (edificioOrError == null) {
            return Result.fail<void>("Erro ao salvar edificio");
        }
        let pisoOrError = await this.pisoRepo.save(piso);
        if (pisoOrError == null) {
            return Result.fail<void>("Erro ao salvar o piso");
        }
        return Result.ok<void>();
    }
    async criarObjetoSala(listaPontosOrErr: Ponto[], categoria: string, descricao: string): Promise<Result<any>> {
        let maxId = await this.salaRepo.getMaxId();
        maxId = maxId + 1;
        let idSalaOuErro = IdSala.create(maxId);

        let categoriaOuErro = CategorizacaoSala.create(categoria);
        if (categoriaOuErro.isFailure) {
            return Result.fail<ISalaDTO>(categoriaOuErro.errorValue());
        }

        let descricaoOuErro = DescricaoSala.create(descricao);
        if (descricaoOuErro.isFailure) {
            return Result.fail<ISalaDTO>(descricaoOuErro.errorValue());
        }

        const salaOuErro = Sala.create({
            categoria: categoriaOuErro.getValue(),
            descricao: descricaoOuErro.getValue(),
            listaPontos: listaPontosOrErr,
        }, idSalaOuErro.getValue());

        return salaOuErro;
    }

    async validarDados(salaDTO: ISalaDTO): Promise<Result<any>> {
        let salaDocument = await this.salaRepo.findByDomainId(salaDTO.id)
        if (salaDocument != null) {
            return Result.fail<ISalaDTO>("Sala já existe");
        }
        let edificioDocument = await this.edificioRepo.findByDomainId(salaDTO.codigoEdificio);
        if (edificioDocument == null) {
            return Result.fail<ISalaDTO>("Edificio não existe");
        }
        if (!edificioDocument.verificaSePisoJaExiste(salaDTO.numeroPiso)) {
            return Result.fail<ISalaDTO>("Piso não existe");
        }
        if (!edificioDocument.posicaoValidaNoMapa(salaDTO.abcissaA, salaDTO.ordenadaA, salaDTO.orientacao)) {
            return Result.fail<ISalaDTO>("Posição A não é válida");
        }
        let pontoAValueOrError = await edificioDocument.returnPontoDoPisoEspecifico(salaDTO.abcissaA, salaDTO.ordenadaA, salaDTO.numeroPiso);
        if (pontoAValueOrError.isFailure) {
            return Result.fail<ISalaDTO>(pontoAValueOrError.errorValue());
        }
        let pontoA = pontoAValueOrError.getValue();

        if (!edificioDocument.posicaoValidaNoMapa(salaDTO.abcissaB, salaDTO.ordenadaB, salaDTO.orientacao)) {
            return Result.fail<ISalaDTO>("Posição B não é válida");
        }

        let pontoBOrError = await edificioDocument.returnPontoDoPisoEspecifico(salaDTO.abcissaB,
            salaDTO.ordenadaB, salaDTO.numeroPiso,);

        if (pontoBOrError.isFailure) {
            return Result.fail<ISalaDTO>(pontoBOrError.errorValue());
        }

        let pontoB = pontoBOrError.getValue();

        const a = await this.alterarDados(salaDTO, edificioDocument, pontoA);

        if (a.isFailure) {
            return Result.fail<ISalaDTO>(a.errorValue());
        }

        edificioDocument = a.getValue().edificioDocument;
        pontoA = a.getValue().ponto;


        const b = await this.alterarDados(salaDTO, edificioDocument, pontoB);

        if (b.isFailure) {
            return Result.fail<ISalaDTO>(b.errorValue());
        }

        edificioDocument = b.getValue().edificioDocument;
        pontoB = b.getValue().ponto;

        const piso = edificioDocument.returnPisoPeloNumero(salaDTO.numeroPiso);

        return Result.ok<any>({
            "edificioDocument": edificioDocument,
            "pontoA": pontoA,
            "pontoB": pontoB,
            "piso": piso,
        });
    }

    async alterarDados(salaDTO: ISalaDTO, edificioDocument: Edificio, ponto: Ponto): Promise<Result<any>> {
        let nPiso = salaDTO.numeroPiso;
        let flag = await edificioDocument.alterarPontosPorSala(ponto, nPiso, salaDTO.orientacao);
        if (flag.isFailure) {
            return Result.fail<any>(flag.errorValue());
        }
        if (!flag.getValue()) {
            return Result.fail<any>("Não se encontrou um ponto para alterar");
        }
        let pontoOrError = await edificioDocument.returnPontoDoPisoEspecifico(salaDTO.abcissaA, salaDTO.ordenadaA, nPiso);

        if (pontoOrError.isFailure) {
            return Result.fail<any>(pontoOrError.errorValue());
        }

        ponto = pontoOrError.getValue();
        return Result.ok<any>({
            "edificioDocument": edificioDocument,
            "ponto": ponto,
        });
    }
}