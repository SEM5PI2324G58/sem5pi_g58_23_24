import { AggregateRoot } from "../../core/domain/AggregateRoot";
import { UniqueEntityID } from "../../core/domain/UniqueEntityID";
import { Result } from "../../core/logic/Result";
import { NumeroPiso } from "./NumeroPiso";
import { DescricaoPiso } from "./DescricaoPiso";
import { Guard } from "../../core/logic/Guard";
import { IdPiso } from "./IdPiso";
import { Ponto } from "../ponto/Ponto";
import { map } from "lodash";


interface pisoProps {
  numeroPiso: NumeroPiso;
  descricaoPiso: DescricaoPiso;
  mapa: Ponto[][];
}

export class Piso extends AggregateRoot<pisoProps> {

  public returnIdPiso() : number{
    return Number(this._id.toValue());
  }

  public returnNumeroPiso() : number{
    return this.props.numeroPiso.props.nPiso;
  }

  public returnDescricaoPiso() : string{
    return this.props.descricaoPiso.props.descricao;
  }

  public returnListaDeIdDosPontos() : string[][]{
    let ids: string[][] = [];
    for (let i = 0; i < this.props.mapa.length; i++) {
      ids[i] = [];
      for (let j = 0; j < this.props.mapa[i].length; j++) {
        ids[i][j] = this.props.mapa[i][j].id.toString();
      }
    }  
    return ids;
  }

  private constructor (props : pisoProps, id?: IdPiso) {
      super(props,id);
  }

  public static create (props: pisoProps, id?: IdPiso): Result<Piso> {

    const guardedProps = [
      { argument: props.numeroPiso, argumentName: 'numeroPiso' },
      { argument: props.descricaoPiso, argumentName: 'descricaoPiso' },
      { argument: props.mapa, argumentName: 'mapa' },
    ];

    let guard1 = Guard.againstNullOrUndefined(guardedProps[0].argument,guardedProps[0].argumentName);
    let guard2 = Guard.againstNullOrUndefined(guardedProps[2].argument,guardedProps[2].argumentName);

    let guardResult = Guard.combine([guard1,guard2]);

    if (!guardResult.succeeded) {
      return Result.fail<Piso>(guardResult.message)
    }     
    else {
      const piso = new Piso({
        ...props
      }, id);

      return Result.ok<Piso>(piso);
    }
  }

  public returnPontosParaElevador(xCoordSup: number, yCoordSup: number, orientacao : string) : Ponto[]{
    let pontos: Ponto[] = [];

    pontos.push(this.props.mapa[xCoordSup][yCoordSup]);

    if (orientacao === 'norte'){  
      pontos.push(this.props.mapa[xCoordSup][yCoordSup+1]);
    }else if(orientacao === 'oeste'){
      pontos.push(this.props.mapa[xCoordSup+1][yCoordSup]);
    }

    return pontos;
  }
  /**
   * Elimina o elevador do mapa, mudando o tipo dos pontos para parede ou vazio
   * @param coords array com as coordenadas dos ponto do elevador
   */
  public reverterElevadorNoMapa(coords: number[]){
    let x = this.props.mapa.length;
    let y = this.props.mapa[0].length;
    
    for (let i = 0; i < coords.length; i = i+2){
      if(coords[i] == 0 && coords[i+1] ==0 ) {
        this.props.mapa[coords[i]][coords[i+1]].toParedeNorteOeste(); //"NorteOeste"
      } else if(coords[i] == x-1 && coords[i+1] == y-1 ) {
       this.props.mapa[coords[i]][coords[i+1]].toVazio(); //" "
      }else if((coords[i+1] == y-1) || (coords[i+1] == 0)) {
        this.props.mapa[coords[i]][coords[i+1]].toParedeNorte(); //"Norte"
      }else if ((coords[i] == x-1) || (coords[i] == 0)){
        this.props.mapa[coords[i]][coords[i+1]].toParedeOeste();//"Oeste"
      }else{
        this.props.mapa[coords[i]][coords[i+1]].toVazio(); //" "
      }
    }
  }
}