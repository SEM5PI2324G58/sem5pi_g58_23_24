import { UniqueEntityID } from "../../core/domain/UniqueEntityID";
import { Result } from "../../core/logic/Result";
import { Guard } from "../../core/logic/Guard";


export default class IdSala extends UniqueEntityID{
  private constructor(props:number){
      super(props);
  }

  /**
   * This method creates a new IdSala object instance from a number passed as parameter. 
   * It also validates the number format and value before returning the object.
   * @param id 
   * @returns Result of type IdSala
   */
  public static create (id: number): Result<IdSala> {
    let guardResults: any[] = [];
    guardResults.push(Guard.againstNullOrUndefined(id, "id"));
    guardResults.push(Guard.numberGreaterThanZero(id, "id"));
    let guardFinal = Guard.combine(guardResults);
    if(guardFinal.succeeded === false){
      return Result.fail<IdSala>(guardFinal.message);
    }
    const idPassagem = new IdSala(id);
    return Result.ok<IdSala>(idPassagem);
  }
}