import { Service, Inject } from 'typedi';
import config from "../../config";
import { Result } from "../core/logic/Result";
import IPassagemRepo from './IRepos/IPassagemRepo';
import IPassagemDTO from '../dto/IPassagemDTO';
import IPassagemService from './IServices/IPassagemService';
import IEdificioRepo from './IRepos/IEdificioRepo';
import { Passagem } from '../domain/passagem/Passagem';
import IPontoRepo from './IRepos/IPontoRepo';
import { IdPassagem } from '../domain/passagem/IdPassagem';
import { Ponto } from '../domain/ponto/Ponto';
import { Piso } from '../domain/piso/Piso';
import { Edificio } from '../domain/edificio/Edificio';

@Service()

@Service()
export default class PassagemService implements IPassagemService {

    constructor(
        @Inject(config.repos.passagem.name) private passagemRepo: IPassagemRepo,
        @Inject(config.repos.piso.name) private edificioRepo: IEdificioRepo,
        @Inject(config.repos.ponto.name) private pontoRepo: IPontoRepo,
    ) { }

    public async criarPassagem(passagemDTO: IPassagemDTO): Promise<Result<IPassagemDTO>> {
        try {
            const validacaoResultado = await this.validarDados(passagemDTO);

            if (validacaoResultado.isFailure) {
                return Result.fail<IPassagemDTO>(validacaoResultado.errorValue());
            }

            const { edificioDocumentA, edificioDocumentB, pontoA, pontoB, pontoA1, pontoB1, pisoA, pisoB } 
            = validacaoResultado.getValue();

            const listaPontosOrErr = [pontoA, pontoA1, pontoB, pontoB1]

            const passagemOrError = await this.criarObjetoPassagem(listaPontosOrErr, pisoA, pisoB);
            if (passagemOrError.isFailure) {
                return Result.fail<IPassagemDTO>(passagemOrError.errorValue());
            }

            let okouErro = await this.salvarDados(passagemOrError.getValue(), 
            edificioDocumentA, edificioDocumentB, pontoA, pontoB, pontoA1, pontoB1);

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
        if (!edificioDocumentA.posicaoValidaNoMapa(passagemDTO.abcissaA, passagemDTO.ordenadaA, passagemDTO.orientacao)) {
            return Result.fail<IPassagemDTO>("Posição A não é válida");
        }

        let pontoAValueOrError = await edificioDocumentA.returnPontoDoPisoEspecifico(passagemDTO.abcissaA, passagemDTO.ordenadaA, passagemDTO.numeroPisoA);

        if (pontoAValueOrError.isFailure) {
            return Result.fail<IPassagemDTO>(pontoAValueOrError.errorValue());
        }

        let pontoA = pontoAValueOrError.getValue();

        let flag = await edificioDocumentA.existePontoNoLimite(passagemDTO.numeroPisoA, pontoA);
        
        if (flag.isFailure) {
            return Result.fail<IPassagemDTO>(flag.errorValue());
        }
        if (!flag.getValue()) {
            return Result.fail<IPassagemDTO>("Ponto A não é um ponto de passagem");
        }

        const a = await this.alterarDados(passagemDTO, edificioDocumentA, pontoA);

        if (a.isFailure) {
            return Result.fail<IPassagemDTO>(a.errorValue());
        }

        edificioDocumentA = a.getValue().edificioDocument;
        pontoA = a.getValue().ponto;
        let pontoA1 = a.getValue().pontoSeguinte;

        let edificioDocumentB = await this.edificioRepo.findByDomainId(passagemDTO.codigoEdificioB);

        if (edificioDocumentB == null) {
            return Result.fail<IPassagemDTO>("Edificio B não existe");
        }
        if (!edificioDocumentB.verificaSePisoJaExiste(passagemDTO.numeroPisoB)) {
            return Result.fail<IPassagemDTO>("Piso B não existe");
        }
        if (!edificioDocumentB.posicaoValidaNoMapa(passagemDTO.abcissaB, passagemDTO.ordenadaB, passagemDTO.orientacao)) {
            return Result.fail<IPassagemDTO>("Posição B não é válida");
        }

        let pontoBOrError = await edificioDocumentB.returnPontoDoPisoEspecifico(passagemDTO.abcissaB, 
            passagemDTO.ordenadaB,passagemDTO.numeroPisoB,);

        if (pontoBOrError.isFailure) {
            return Result.fail<IPassagemDTO>(pontoBOrError.errorValue());
        }

        let pontoB = pontoBOrError.getValue();

        if (!edificioDocumentB.existePontoNoLimite(passagemDTO.numeroPisoB, pontoB)) {
            return Result.fail<IPassagemDTO>("Ponto B não é um ponto de passagem");
        }

        const b = await this.alterarDados(passagemDTO, edificioDocumentB, pontoB);

        if (b.isFailure) {
            return Result.fail<IPassagemDTO>(b.errorValue());
        }

        edificioDocumentB = b.getValue().edificioDocument;
        pontoB = b.getValue().ponto;
        let pontoB1 = b.getValue().pontoSeguinte;

        const pisoA = edificioDocumentA.returnPisoPeloNumero(passagemDTO.numeroPisoA);
        const pisoB = edificioDocumentB.returnPisoPeloNumero(passagemDTO.numeroPisoB);

        return Result.ok<any>({
            "edificioDocumentA": edificioDocumentA,
            "edificioDocumentB": edificioDocumentB,
            "pontoA": pontoA,
            "pontoB": pontoB,
            "pontoA1": pontoA1,
            "pontoB1": pontoB1,
            "pisoA": pisoA,
            "pisoB": pisoB
        });
    }

    private async alterarDados(passagemDTO: IPassagemDTO, edificioDocument: Edificio, ponto: Ponto): Promise<Result<any>> {
        let nPiso = passagemDTO.numeroPisoA;
        let pontoSeguinteOrError = await edificioDocument.obterPontoSeguinte(ponto, nPiso, passagemDTO.orientacao);

        if (pontoSeguinteOrError.isFailure) {
            return Result.fail<any>(pontoSeguinteOrError.errorValue());
        }

        let pontoSeguinte = pontoSeguinteOrError.getValue();

        let flag = await edificioDocument.alterarPontosPorPassagem(ponto, nPiso, passagemDTO.orientacao);
        if (flag.isFailure) {
            return Result.fail<any>(flag.errorValue());
        }
        if (!flag.getValue()) {
            return Result.fail<any>("Não se encontrou um ponto para alterar");
        }

        flag = await edificioDocument.alterarPontosPorPassagem(pontoSeguinte, nPiso, passagemDTO.orientacao);

        if (flag.isFailure) {
            return Result.fail<any>(flag.errorValue());
        }
        if (!flag.getValue()) {
            return Result.fail<any>("Não se encontrou um ponto para alterar");
        }

        let pontoOrError = await edificioDocument.returnPontoDoPisoEspecifico(passagemDTO.abcissaA, passagemDTO.ordenadaA, nPiso);

        if (pontoOrError.isFailure) {
            return Result.fail<any>(pontoOrError.errorValue());
        }
        
        ponto = pontoOrError.getValue();

        pontoSeguinteOrError = await edificioDocument.
        returnPontoDoPisoEspecifico(pontoSeguinte.props.coordenadas.props.abscissa,
            pontoSeguinte.props.coordenadas.props.ordenada, nPiso);

        if (pontoSeguinteOrError.isFailure) {
            return Result.fail<any>(pontoSeguinteOrError.errorValue());
        }

        pontoSeguinte = pontoSeguinteOrError.getValue();

        return Result.ok<any>({
            "edificioDocument": edificioDocument,
            "ponto": ponto,
            "pontoSeguinte": pontoSeguinte
        });
    }

    private async criarObjetoPassagem(listaPontos: Ponto[], pisoA: Piso, pisoB: Piso): Promise<Result<Passagem>> {

        let maxId = await this.passagemRepo.getMaxId();
        maxId = maxId + 1;
        let idPassagemOuErro = await IdPassagem.create(maxId);

        const passagemOuErro = Passagem.create({
            listaPontos: listaPontos,
            pisoA: pisoA,
            pisoB: pisoB,
        }, idPassagemOuErro.getValue());

        return passagemOuErro;
    }

    private async salvarDados(passagem: Passagem, edificioDocumentA: Edificio, edificioDocumentB: Edificio,
        pontoA: Ponto, pontoB: Ponto, pontoA1: Ponto, pontoB1: Ponto): Promise<Result<void>> {
        
        let passagemOrError = await this.passagemRepo.save(passagem);
        if (passagemOrError==null) {
            return Result.fail<void>("Erro ao salvar passagem");
        }
        let pontoOrError = await this.pontoRepo.save(pontoA);
        if (pontoOrError==null) {
            return Result.fail<void>("Erro ao salvar ponto A");
        }
        pontoOrError = await this.pontoRepo.save(pontoB);
        if (pontoOrError==null) {
            return Result.fail<void>("Erro ao salvar ponto B");
        }
        pontoOrError = await this.pontoRepo.save(pontoA1);
        if (pontoOrError==null) {
            return Result.fail<void>("Erro ao salvar ponto A1");
        }
        pontoOrError = await this.pontoRepo.save(pontoB1);
        if (pontoOrError==null) {
            return Result.fail<void>("Erro ao salvar ponto B1");
        }
        let edificioOrError = await this.edificioRepo.save(edificioDocumentA);
        if (edificioOrError==null) {
            return Result.fail<void>("Erro ao salvar edificio A");
        }
        edificioOrError = await this.edificioRepo.save(edificioDocumentB);
        if (edificioOrError==null) {
            return Result.fail<void>("Erro ao salvar edificio B");
        }

        return Result.ok<void>();
    }
}
