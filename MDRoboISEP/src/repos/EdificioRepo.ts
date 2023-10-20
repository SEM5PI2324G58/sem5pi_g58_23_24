import { Service, Inject } from 'typedi';

import IEdifcioRepo from "../services/IRepos/IEdificioRepo";
import { EdificioMap } from "../mappers/EdificioMap";

import { Edificio } from "../domain/edificio/Edificio";
import { Codigo } from '../domain/edificio/Codigo';
import { Document, FilterQuery, Model } from 'mongoose';
import { IEdificioPersistence } from '../dataschema/IEdificioPersistence';

@Service()
export default class EdificioRepo implements IEdifcioRepo {
  private models: any;

  constructor(
    @Inject('edificioSchema') private edificioSchema : Model<IEdificioPersistence & Document>,
  ) {}

  private createBaseQuery (): any {
    return {
      where: {},
    }
  }

  public async exists(edificio: Edificio): Promise<boolean> {
    
    const idX = edificio.id instanceof Codigo ? (<Codigo>edificio.id).toValue() : edificio.id;

    const query = { domainId: idX}; 
    const roleDocument = await this.edificioSchema.findOne( query as FilterQuery<IEdificioPersistence & Document>);

    return !!roleDocument === true;
  }

  public async save (edificio: Edificio): Promise<Edificio> {
    const query = { domainId: edificio.id.toString()}; 

    const edificioDocument = await this.edificioSchema.findOne( query );

    try {
      if (edificioDocument === null ) {
        const rawEdificio: any = EdificioMap.toPersistence(edificio);

        const edificioCreated = await this.edificioSchema.create(rawEdificio);

        return EdificioMap.toDomain(edificioCreated);
      } else {
        edificioDocument.id = edificio.id;
        await edificioDocument.save();

        return edificio;
      }
    } catch (err) {
      throw err;
    }
  }

  public async findByDomainId (codigo: Codigo | string): Promise<Edificio> {
    const query = { domainId: codigo};
    const edificioRecord = await this.edificioSchema.findOne( query as FilterQuery<IEdificioPersistence & Document> );

    if( edificioRecord != null) {
      return EdificioMap.toDomain(edificioRecord);
    }
    else
      return null;
  }
}