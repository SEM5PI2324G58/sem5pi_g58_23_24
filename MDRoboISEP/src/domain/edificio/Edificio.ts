import { AggregateRoot } from "../../core/domain/AggregateRoot";
import { Nome } from "./Nome";
import { Dimensao } from "./Dimensao";
import { DescricaoEdificio } from "./DescricaoEdificio";
import { UniqueEntityID } from "../../core/domain/UniqueEntityID";
import { Result } from "../../core/logic/Result";
import { Piso } from "../piso/Piso";
import { Guard } from "../../core/logic/Guard";
import { Elevador } from "../elevador/Elevador";



interface EdificioProps{
  nome?: Nome;
  dimensao: Dimensao;
  descricao?: DescricaoEdificio;
  listaPisos: Piso[];
  elevador?: Elevador;
}

export class Edificio extends AggregateRoot<EdificioProps> {
  private constructor (props: EdificioProps, id: UniqueEntityID){
    super(props, id);
  }
  
  public addPiso(piso: Piso){
    this.props.listaPisos.push(piso);
  }
  
  public static create (props:EdificioProps, codigo :UniqueEntityID): Result<Edificio> {
    
    const guardedProps = { argument: props.dimensao, argumentName: 'dimensão' };
    const result = Guard.againstNullOrUndefined(guardedProps.argument,guardedProps.argumentName);
    
    if(result.succeeded === false){
      return Result.fail<Edificio>(result.message);
    }else{
      const edificio = new Edificio({...props}, codigo);
      return Result.ok<Edificio>(edificio);
    }
  }
  
  public returnNome(): String{
    return this.props.nome.props.nome;
  }
  
  public returnDescricao(): String{
    return this.props.descricao.props.descricao;
  }
  
  public returnDimensaoX(): number{
    return this.props.dimensao.props.x;
  }
  
  public returnDimensaoY(): number{
    return this.props.dimensao.props.y;
  }
  
  public returnEdificioId(): string{
    return this.id.toString();
  }
  
  public returnListaPisosId(): number[]{
    let listaPisos: number[] = [];
    for(let i = 0; i < this.props.listaPisos.length; i++){
      listaPisos.push(Number(this.props.listaPisos[i].id.toValue()));
    }
    return listaPisos;
  }
  /**
   * Verifica se já existe um elevador no edifício
   * @returns true se existir um elevador, false caso contrário
   */
  public temElevador() : boolean{
    return this.props.elevador === null;
  }

  /**
   * Verifica se é possível colocar um elevador numa determinada posição do edifício
   * @param xCoordSup coordenada x do ponto superior do elevador
   * @param yCoordSup coordenada y do ponto superior do elevador
   * @param orientacao 'norte' ou 'oeste' dita se o elevador está na vertical ou horizontal
   * @returns true se a posição é válida, false caso contrário
   */
  public posicaoValidaNoMapa(xCoordSup: number, yCoordSup: number, orientacao : string) :boolean{
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

    if(orientacao === 'norte'){
      xCoordInf = xCoordSup+1;
      yCoordInf = yCoordSup;
    }else if (orientacao === 'oeste'){
      xCoordInf = xCoordSup;
      yCoordInf = yCoordSup+1;
    }

    // Coordendas do ponto inferior têm de estar dentro das dimensões do edifício
    if (xCoordInf > this.props.dimensao.props.x || yCoordInf > this.props.dimensao.props.y){
      return false;
    }
    return true;
  }

  public adicionarElevador(elevador : Elevador){
    this.props.elevador = elevador;
  }

  public returnElevadorId(): string{
    return this.props.elevador.id.toString();
  }
}