import { AggregateRoot } from "../../core/domain/AggregateRoot";
import { Nome } from "./Nome";
import { Dimensao } from "./Dimensao";
import { DescricaoEdificio } from "./DescricaoEdificio";
import { UniqueEntityID } from "../../core/domain/UniqueEntityID";
import { Result } from "../../core/logic/Result";
import { Piso } from "../piso/Piso";
import { Guard } from "../../core/logic/Guard";
import { Elevador } from "../elevador/Elevador";
import { Ponto } from "../ponto/Ponto";



interface EdificioProps {
  nome?: Nome;
  dimensao: Dimensao;
  descricao?: DescricaoEdificio;
  listaPisos: Piso[];
  elevador?: Elevador;
}

export class Edificio extends AggregateRoot<EdificioProps> {

  alterarPontosPorPassagem(pontoA: Ponto, idPisoA: string) {
    
    let listaPisos = this.props.listaPisos;
    for (let index = 0; index < listaPisos.length; index++) {
      let piso = listaPisos[index];
      if (piso.id.toString() == idPisoA) {
        for (let i = 0; i < piso.props.mapa.length; i++) {
          for (let j = 0; j < piso.props.mapa[i].length; j++) {
            let ponto = piso.props.mapa[i][j];
            if (ponto.props.coordenadas.props.abscissa == pontoA.props.coordenadas.props.abscissa
              && ponto.props.coordenadas.props.ordenada == pontoA.props.coordenadas.props.ordenada) {
              ponto.props.tipoPonto.props.tipoPonto = "Passagem";
            }
          }
        }
      }
    }

  }

  getPonto(abcissa: number, ordenada: number, idPiso): Ponto {
    let listaPisos = this.props.listaPisos;
    for (let index = 0; index < listaPisos.length; index++) {
      let piso = listaPisos[index];
      if (piso.id.toString() == idPiso) {
        for (let i = 0; i < piso.props.mapa.length; i++) {
          for (let j = 0; j < piso.props.mapa[i].length; j++) {
            let ponto = piso.props.mapa[i][j];
            if (ponto.props.coordenadas.props.abscissa == abcissa && ponto.props.coordenadas.props.ordenada == ordenada) {
              return ponto;
            }
          }
        }
      }
    }
  }



  existePontoNoLimite(idPiso: string, pontos: Ponto) {

    let listaPisos = this.props.listaPisos;

    function validarÉIgualENoLimite(ponto: Ponto, pontos: Ponto, i: number, piso: Piso) {
      if (ponto.props.coordenadas.props.abscissa == pontos.props.coordenadas.props.abscissa
        && ponto.props.coordenadas.props.ordenada == pontos.props.coordenadas.props.ordenada) {
        if (ponto.props.coordenadas.props.ordenada == piso.props.mapa.length ||
          ponto.props.coordenadas.props.abscissa == piso.props.mapa[i].length ||
          ponto.props.coordenadas.props.ordenada == 0 || ponto.props.coordenadas.props.abscissa == 0) {
          return true;
        }
      }
      return false;
    }

    function percorrerMapaDoPisoEValidarPonto(idPiso: string, pontos: Ponto, piso: Piso) {
      if (piso.id.toString() == idPiso) {
        for (let i = 0; i < piso.props.mapa.length; i++) {
          for (let j = 0; j < piso.props.mapa[i].length; j++) {
            let ponto = piso.props.mapa[i][j];
            if (validarÉIgualENoLimite(ponto, pontos, i, piso)) {
              return true;
            }
          }
        }
      }
      return false;
    }

    for (let index = 0; index < listaPisos.length; index++) {
      let piso = listaPisos[index];
      if (percorrerMapaDoPisoEValidarPonto(idPiso, pontos, piso)) {
        return true;
      }
    }

    return false;
  }

  verificarPisoExiste(idPiso: string) {
    let listaPisos = this.props.listaPisos;
    for (let index = 0; index < listaPisos.length; index++) {
      const piso = listaPisos[index];
      if (piso.id.toString() == idPiso) {
        return true;
      }
    }
  }
  private constructor(props: EdificioProps, id: UniqueEntityID) {
    super(props, id);
  }

  public addPiso(piso: Piso) {
    this.props.listaPisos.push(piso);
  }

  public static create(props: EdificioProps, codigo: UniqueEntityID): Result<Edificio> {

    const guardedProps = [{ argument: props.dimensao, argumentName: 'dimensão' },
    { argument: props.listaPisos, argumentName: 'lista de pisos' }];

    const result = Guard.againstNullOrUndefinedBulk(guardedProps);

    if (result.succeeded === false) {
      return Result.fail<Edificio>(result.message);
    } else {
      const edificio = new Edificio({ ...props }, codigo);
      return Result.ok<Edificio>(edificio);
    }
  }

  public returnNome(): string {
    return this.props.nome.props.nome;
  }

  public returnDescricao(): string {
    return this.props.descricao.props.descricao;
  }

  public returnDimensaoX(): number {
    return this.props.dimensao.props.x;
  }

  public returnDimensaoY(): number {
    return this.props.dimensao.props.y;
  }

  public returnEdificioId(): string {
    return this.id.toString();
  }

  public returnListaPisosId(): number[] {
    let listaPisos: number[] = [];
    for (let i = 0; i < this.props.listaPisos.length; i++) {
      listaPisos.push(Number(this.props.listaPisos[i].id.toValue()));
    }
    return listaPisos;
  }

  public verificaSePisoJaExiste(nPiso: number): boolean {
    for (let i = 0; i < this.props.listaPisos.length; i++) {
      if (this.props.listaPisos[i].returnNumeroPiso() === nPiso) {
        return true;
      }
    }
    return false;
  }
  /**
   * Verifica se já existe um elevador no edifício
   * @returns true se existir um elevador, false caso contrário
   */
  public temElevador(): boolean {
    return this.props.elevador !== undefined;
  }

  /**
   * Verifica se é possível colocar um elevador numa determinada posição do edifício
   * @param xCoordSup coordenada x do ponto superior do elevador
   * @param yCoordSup coordenada y do ponto superior do elevador
   * @param orientacao 'norte' ou 'oeste' dita se o elevador está na vertical ou horizontal
   * @returns true se a posição é válida, false caso contrário
   */
  public posicaoValidaNoMapa(xCoordSup: number, yCoordSup: number, orientacao: string): boolean {
    //TODO
    /*
    - para todos os pisos no intervalo dos pisos servidos(ex serve pisos 1 e 3, tenho de ver o piso 2 na mesma):
      - não pode ser dentro de uma sala
      - não pode ter porta adjacente (na diagonal pode)
      - não pode ser em cima de uma passagem
    */
    // Coordenadas do ponto inferior
    let xCoordInf;
    let yCoordInf;

    if (orientacao === 'norte') {
      xCoordInf = xCoordSup;
      yCoordInf = yCoordSup + 1;
    } else if (orientacao === 'oeste') {
      xCoordInf = xCoordSup + 1;
      yCoordInf = yCoordSup;
    }

    // Coordendas do ponto inferior têm de estar dentro das dimensões do edifício
    if (xCoordInf > this.props.dimensao.props.x || yCoordInf > this.props.dimensao.props.y) {
      return false;
    }
    return true;
  }

  public adicionarElevador(elevador: Elevador) {
    this.props.elevador = elevador;
  }

  public returnElevadorId(): number {
    return Number(this.props.elevador.id.toValue());

  }

  public verificaSeONumeroDePisosEstaDentroDosLimites(minPisos: number, maxPisos: number): boolean {
    if (this.props.listaPisos.length >= minPisos && this.props.listaPisos.length <= maxPisos) {
      return true;
    }
    return false;
  }
  /**
   * Retorna o elevador do Edifício
   * @returns instância do elevador se existir, null caso não existir
   */
  public returnElevador(): Elevador {
    if (this.temElevador()) {
      return this.props.elevador;
    } else {
      return null;
    }
  }
  /**
   * Obter os pisos de um edifício a partir de um array de números de piso
   * @param numerosDePiso números dos pisos para dar match
   * @returns array de pisos que deram match
   */
  public pisosCorrespondentes(numerosDePiso: number[]): Piso[] {
    let res: Piso[] = [];

    for (let i = 0; i < this.props.listaPisos.length; i++) {
      for (let j = 0; j < numerosDePiso.length; j++) {
        if (this.props.listaPisos[i].returnNumeroPiso() === numerosDePiso[j]) {
          res.push(this.props.listaPisos[i]);
        }
      }
    }

    return res;
  }
}