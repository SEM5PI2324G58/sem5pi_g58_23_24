import { Mapper } from "../core/infra/Mapper";
import IPassagemDTO from "../dto/IPassagemDTO";
import { Passagem } from "../domain/passagem/Passagem";

export class PassagemMap extends Mapper<Passagem> {

  public static toDTO(passagem: Passagem): IPassagemDTO {
    //Not implemented yet
    //return error
    return null;
  }

  public static async toDomain(raw: any): Promise<Passagem> {
    //Not implemented yet
    //return error
    return null;
  }

  public static toPersistence(passagem: Passagem): any {
    //Not implemented yet
    //return error
    return null;
  }
}