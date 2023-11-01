import { Service, Inject } from 'typedi';

import { Document, FilterQuery, Model } from 'mongoose';

import { forEach } from 'lodash';
import IdSala from '../domain/sala/IdSala';
import { Sala } from '../domain/sala/Sala';
import { ISalaPersistence } from '../dataschema/ISalaPersistence';
import { SalaMap } from '../mappers/SalaMap';
import ISalaRepo from '../services/IRepos/ISalaRepo';

@Service()
export default class SalaRepo implements ISalaRepo {
  private models: any;

  constructor(
    @Inject('SalaSchema') private salaSchema: Model<ISalaPersistence & Document>,
  ) { }

    async getMaxId(): Promise<number> {
    try {
      var maxIdResult = await this.salaSchema
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

  private createBaseQuery(): any {
    return {
      where: {},
    }
  }

  public async exists(sala: Sala): Promise<boolean> {

    const idX = sala.id instanceof IdSala ? (<IdSala>sala.id).toValue() : sala.id;

    const query = { codigo: idX };
    const roleDocument = await this.salaSchema.findOne(query as FilterQuery<ISalaPersistence & Document>);

    return !!roleDocument === true;
  }

  public async save(sala: Sala): Promise<Sala> {

    const id = 'some_id'; // replace with the actual id we need
    const query = { domainID: id };

    const salaDocument = await this.salaSchema.findOne(query);

    try {
      if (salaDocument === null) {
        const rawSala: any = SalaMap.toPersistence(sala);

        const salaCreated = await this.salaSchema.create(rawSala);

        return SalaMap.toDomain(salaCreated);
      } else {
        salaDocument.id = sala.id;
        const listaPontos = [];
        for (let index = 0; index < sala.props.listaPontos.length; index++) {
          const element = sala.props.listaPontos[index];
          listaPontos.push(element.id.toString());
        }
        salaDocument.listaPontos = listaPontos;
        await salaDocument.save();

        return sala;
      }
    } catch (err) {
      throw err;
    }
  }

  public async findByDomainId(idSala: IdSala | number): Promise<Sala> {
    const query = { idSala: idSala };
    const salaRecord = await this.salaSchema.findOne(query as FilterQuery<ISalaPersistence & Document>);

    if (salaRecord != null) {
      return SalaMap.toDomain(salaRecord);
    }
    else
      return null;
  }

}