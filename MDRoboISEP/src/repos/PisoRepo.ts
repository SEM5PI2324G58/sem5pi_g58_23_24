import { Service, Inject } from 'typedi';

import IPisoRepo from "../services/IRepos/IPisoRepo";
import { Piso } from "../domain/piso/Piso";
import { IdPiso } from "../domain/piso/IdPiso";
import { PisoMap } from "../mappers/PisoMap";

import { Document, FilterQuery, Model } from 'mongoose';
import { IPisoPersistence } from '../dataschema/IPisoPersistence';

@Service()
export default class PisoRepo implements IPisoRepo {
  private models: any;

  constructor(
    @Inject('PisoSchema') private pisoSchema : Model<IPisoPersistence & Document>,
  ) {}

  private createBaseQuery (): any {
    return {
      where: {},
    }
  }

  public async exists(piso: Piso): Promise<boolean> {
    
    const idX = piso.id instanceof IdPiso ? (<IdPiso>piso.id).toValue() : piso.id;

    const query = { domainId: idX}; 
    const roleDocument = await this.pisoSchema.findOne( query as FilterQuery<IPisoPersistence & Document>);

    return !!roleDocument === true;
  }

  public async save (piso: Piso): Promise<Piso> {
    const query = { domainId: piso.id.toString()}; 

    const pisoDocument = await this.pisoSchema.findOne( query );

    try {
      if (pisoDocument === null ) {
        const rawPiso: any = PisoMap.toPersistence(piso);

        const pisoCreated = await this.pisoSchema.create(rawPiso);

        return PisoMap.toDomain(pisoCreated);
      } else {
        pisoDocument.id = piso.id;
        await pisoDocument.save();

        return piso;
      }
    } catch (err) {
      throw err;
    }
  }

  public async findByDomainId (idPiso: IdPiso | number): Promise<Piso> {
    const query = { domainId: idPiso};
    const pisoRecord = await this.pisoSchema.findOne( query as FilterQuery<IPisoPersistence & Document> );

    if( pisoRecord != null) {
      return PisoMap.toDomain(pisoRecord);
    }
    else
      return null;
  }

  public async getMaxId(): Promise<number> {
    try {
        const maxIdResult = await this.pisoSchema
            .find({}, { id: 1 })
            .sort({ id: -1 })
            .limit(1);

        if (maxIdResult && maxIdResult.length > 0) {
            return maxIdResult[0].id;
        } else {
            return 0; 
        }
    } catch (err) {
        throw err;
    }
}
}