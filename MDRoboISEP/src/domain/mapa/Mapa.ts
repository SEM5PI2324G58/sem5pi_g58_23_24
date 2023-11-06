import { AggregateRoot } from "../../core/domain/AggregateRoot";
import { UniqueEntityID } from "../../core/domain/UniqueEntityID";
import { Result } from "../../core/logic/Result";
import { Guard } from "../../core/logic/Guard";
import { IdMapa } from "./IdMapa";
import { TipoPonto } from "./TipoPonto";
import { CoordenadasPassagem } from "./CoordenadasPassagem";
import { CoordenadasElevador } from "./CoordenadasElevador";
import { CoordenadasSala } from "./CoordenadasSala";
import { publicDecrypt } from "crypto";


interface pisoProps {
    mapa: TipoPonto[][];
    coordenadasPassagem: CoordenadasPassagem[];
    coordenadasElevador: CoordenadasElevador;
    coordenadasSala: CoordenadasSala[]; 

}

export class Mapa extends AggregateRoot<pisoProps> {

  private constructor (props : pisoProps, id?: IdMapa) {
      super(props,id);
  }

  public static create (props: pisoProps, id?: IdMapa): Result<Mapa> {

    const guardedProps = [
      { argument: props.mapa, argumentName: 'mapa' },
      { argument: props.coordenadasElevador, argumentName: 'coordenadasElevador' },
      { argument: props.coordenadasPassagem, argumentName: 'coordenadasPassagem' },
      { argument: props.coordenadasSala, argumentName: 'coordenadasSala' },
    ];
    
    let guard = Guard.againstNullOrUndefined(id,'Id Mapa');
    let guard1 = Guard.againstNullOrUndefined(guardedProps[0].argument,guardedProps[0].argumentName);
    let guard3 = Guard.againstNullOrUndefined(guardedProps[2].argument,guardedProps[2].argumentName);
    let guard4 = Guard.againstNullOrUndefined(guardedProps[3].argument,guardedProps[3].argumentName);

    let guardResult = Guard.combine([guard,guard1,guard3,guard4]);

    if (!guardResult.succeeded) {
      return Result.fail<Mapa>(guardResult.message)
    }     
    else {
      const piso = new Mapa({
        ...props
      }, id);

      return Result.ok<Mapa>(piso);
    }
  }

  public returnTipoDePontos(): string[][] {
    let dados : string[][] = [];
    for (let i = 0; i < this.props.mapa.length; i++) {
      dados[i]=[];
      for (let j = 0; j < this.props.mapa[i].length; j++) {
        dados[i][j] = this.props.mapa[i][j].returnTipoPonto();
      }
    }
    return dados;
  }

  public returnIdMapa(): number {
    return Number(this.id.toValue());
  }

  public verificaSeExistePassagens(): boolean {
    if (this.props.coordenadasPassagem.length > 0) {
      return true;
    }
    return false;
  }

  public returnIdPassagem(): number[] {
    let dados : number[] = [];
    for (let i = 0; i < this.props.coordenadasPassagem.length; i++) {
      dados[i] = this.props.coordenadasPassagem[i].returnId();
    }
    return dados;
  }

  public returnAbcissaPassagem(): number[] {
    let dados : number[] = [];
    for (let i = 0; i < this.props.coordenadasPassagem.length; i++) {
      dados[i] = this.props.coordenadasPassagem[i].returnAbcissa();
    }
    return dados;
  }

  public returnOrdenadaPassagem(): number[] {
    let dados : number[] = [];
    for (let i = 0; i < this.props.coordenadasPassagem.length; i++) {
      dados[i] = this.props.coordenadasPassagem[i].returnOrdenada();
    }
    return dados;
  }

  public returnOrientacaoPassagem(): string[] {
    let dados : string[] = [];
    for (let i = 0; i < this.props.coordenadasPassagem.length; i++) {
      dados[i] = this.props.coordenadasPassagem[i].returnOrientacao();
    }
    return dados;
  }

  public verificaSeExisteElevador(): boolean {
    if (this.props.coordenadasElevador !== null && this.props.coordenadasElevador !== undefined) {
      return true;
    }
    return false;
  }

  public returnXCoordElevador(): number[] {
    return this.props.coordenadasElevador.returnXCoord();
  }

  public returnYCoordElevador(): number[] {
    return this.props.coordenadasElevador.returnYCoord();
  }

  public returnOrientacaoElevador(): string {
    return this.props.coordenadasElevador.returnOrientacao();
  }

  public verificaSeExisteSalas(): boolean {
    if (this.props.coordenadasSala.length > 0) {
      return true;
    }
    return false;
  }

  public returnNomeSala(): string[] {
    let dados : string[] = [];
    for (let i = 0; i < this.props.coordenadasSala.length; i++) {
      dados[i] = this.props.coordenadasSala[i].returnNome();
    }
    return dados;
  }

  public returnAbcissaASala(): number[] {
    let dados : number[] = [];
    for (let i = 0; i < this.props.coordenadasSala.length; i++) {
      dados[i] = this.props.coordenadasSala[i].returnAbcissaA();
    }
    return dados;
  }

  public returnOrdenadaASala(): number[] {
    let dados : number[] = [];
    for (let i = 0; i < this.props.coordenadasSala.length; i++) {
      dados[i] = this.props.coordenadasSala[i].returnOrdenadaA();
    }
    return dados;
  }

  public returnAbcissaBSala(): number[] {
    let dados : number[] = [];
    for (let i = 0; i < this.props.coordenadasSala.length; i++) {
      dados[i] = this.props.coordenadasSala[i].returnAbcissaB();
    }
    return dados;
  }

  public returnOrdenadaBSala(): number[] {
    let dados : number[] = [];
    for (let i = 0; i < this.props.coordenadasSala.length; i++) {
      dados[i] = this.props.coordenadasSala[i].returnOrdenadaB();
    }
    return dados;
  }

  public returnAbcissaPortaSala(): number[] {
    let dados : number[] = [];
    for (let i = 0; i < this.props.coordenadasSala.length; i++) {
      dados[i] = this.props.coordenadasSala[i].returnAbcissaPorta();
    }
    return dados;
  }

  public returnOrdenadaPortaSala(): number[] {
    let dados : number[] = [];
    for (let i = 0; i < this.props.coordenadasSala.length; i++) {
      dados[i] = this.props.coordenadasSala[i].returnOrdenadaPorta();
    }
    return dados;
  }

  public returnOrientacaoPortaSala(): string[] {
    let dados : string[] = [];
    for (let i = 0; i < this.props.coordenadasSala.length; i++) {
      dados[i] = this.props.coordenadasSala[i].returnOrientacaoPorta();
    }
    return dados;
  }

}