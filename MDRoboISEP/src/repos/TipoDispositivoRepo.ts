import { Service, Inject } from 'typedi';

import { Document, FilterQuery, Model } from 'mongoose';
import ITipoDispositivoRepo from '../services/IRepos/ITipoDispositivoRepo';
import { ITipoDispositivoPersistence } from '../dataschema/ITipoDispositivoPersistence';
import { TipoDispositivo } from '../domain/tipoDispositivo/TipoDispositivo';
import { IdTipoDispositivo } from '../domain/tipoDispositivo/IdTipoDispositivo';
import { TipoDispositivoMap } from '../mappers/TipoDispositivoMap';

@Service()
export default class TipoDispositivoRepo implements ITipoDispositivoRepo {
  private models: any;

  constructor(
    @Inject('TipoDispositivoSchema') private tipoDispositivoSchema : Model<ITipoDispositivoPersistence & Document>,
  ) {}

  private createBaseQuery (): any {
    return {
      where: {},
    }
  }

  public async exists(tipoDispositivo: TipoDispositivo): Promise<boolean> {
    
    const idX = tipoDispositivo.id instanceof TipoDispositivo ? (<IdTipoDispositivo>tipoDispositivo.id).toValue() : tipoDispositivo.id;

    const query = { id: idX}; 
    const roleDocument = await this.tipoDispositivoSchema.findOne( query as FilterQuery<ITipoDispositivoPersistence & Document>);

    return !!roleDocument === true;
  }

  public async save (tipoDispositivo: TipoDispositivo): Promise<TipoDispositivo> {
    const query = { id: tipoDispositivo.id.toString()}; 

    const tipoDispositivoDocument = await this.tipoDispositivoSchema.findOne( query );

    try {
      if (tipoDispositivoDocument === null ) {
        const rawTipoDispositivo: any = TipoDispositivoMap.toPersistence(tipoDispositivo);

        const tipoDispositivoCreated = await this.tipoDispositivoSchema.create(rawTipoDispositivo);

        return TipoDispositivoMap.toDomain(tipoDispositivoCreated);
      } else {
        tipoDispositivoDocument.id = tipoDispositivo.id;
        await tipoDispositivoDocument.save();

        return tipoDispositivo;
      }
    } catch (err) {
      throw err;
    }
  }

  public async findByDomainId(idTipoDispositivo: IdTipoDispositivo | number): Promise<TipoDispositivo> {
    const query = { id: idTipoDispositivo};
    const tipoDispositivoRecord = await this.tipoDispositivoSchema.findOne( query as FilterQuery<ITipoDispositivoPersistence & Document> );

    if( tipoDispositivoRecord != null) {
      return TipoDispositivoMap.toDomain(tipoDispositivoRecord);
    }
    else
      return null;
  }

  public async getMaxId(): Promise<number> {
    try {
        var maxIdResult = await this.tipoDispositivoSchema
            .find({}, { id: 1 })
           ;

        if (maxIdResult && maxIdResult.length > 0) {
            return (maxIdResult.sort((a, b) => b.id - a.id))[0].id;
        } else {
            return 0; 
        }
    } catch (err) {
        throw err;
    }
}

}