import { Service, Inject } from 'typedi';

import IPassagemRepo from "../services/IRepos/IPassagemRepo";

import { Passagem } from "../domain/passagem/Passagem";
import { Document, FilterQuery, Model } from 'mongoose';
import { IPassagemPersistence } from '../dataschema/IPassagemPersistence';
import { PassagemMap } from '../mappers/PassagemMap';
import { IdPassagem } from '../domain/passagem/IdPassagem';
import { forEach } from 'lodash';

@Service()
export default class PassagemRepo implements IPassagemRepo {
  private models: any;

  constructor(
    @Inject('PassagemSchema') private passagemSchema: Model<IPassagemPersistence & Document>,
  ) { }

    async getMaxId(): Promise<number> {
    try {
      var maxIdResult = await this.passagemSchema
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

  public async exists(passagem: Passagem): Promise<boolean> {

    const idX = passagem.id instanceof IdPassagem ? (<IdPassagem>passagem.id).toValue() : passagem.id;

    const query = { codigo: idX };
    const roleDocument = await this.passagemSchema.findOne(query as FilterQuery<IPassagemPersistence & Document>);

    return !!roleDocument === true;
  }

  public async save(passagem: Passagem): Promise<Passagem> {

    const id = passagem.id.toString();
    const query = { domainID: id };

    const passagemDocument = await this.passagemSchema.findOne(query);

    try {
      if (passagemDocument === null) {
        const rawPassagem: any = PassagemMap.toPersistence(passagem);

        const passagemCreated = await this.passagemSchema.create(rawPassagem);

        return PassagemMap.toDomain(passagemCreated);
      } else {
        passagemDocument.id = passagem.id;
        const listaPontos = [];
        for (let index = 0; index < passagem.props.listaPontos.length; index++) {
          const element = passagem.props.listaPontos[index];
          listaPontos.push(element.id.toString());
        }
        passagemDocument.listaPontos = listaPontos;
        await passagemDocument.save();

        return passagem;
      }
    } catch (err) {
      throw err;
    }
  }

  public async findByDomainId(idPassagem: IdPassagem | number): Promise<Passagem> {
    const query = { idPassagem: idPassagem };
    const passagemRecord = await this.passagemSchema.findOne(query as FilterQuery<IPassagemPersistence & Document>);

    if (passagemRecord != null) {
      return PassagemMap.toDomain(passagemRecord);
    }
    else
      return null;
  }

}