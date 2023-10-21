import { Inject, Service } from "typedi";
import IElevadorRepo from "../services/IRepos/IElevadorRepo";
import { Elevador } from "../domain/elevador/Elevador";
import { IdElevador } from "../domain/elevador/IdElevador";
import { FilterQuery, Model } from "mongoose";
import { IElevadorPersistence } from "../dataschema/IElevadorPersistence";
import { Document } from "mongodb";
import { ElevadorMap } from "../mappers/ElevadorMap";

@Service()
export default class ElevadorRepo implements IElevadorRepo{
    private models: any;

    constructor(
        @Inject('ElevadorSchema')
        private elevadorSchema : Model<IElevadorPersistence & Document>,
    ){}
    
    private createBaseQuery (): any {
        return {
          where: {},
        }
    }

    public async exists(elevador: Elevador): Promise<boolean>{
        const idX = elevador.id instanceof IdElevador ? (<IdElevador>elevador.id).toValue() : elevador.id;
        const query = {domainId: idX};
        const elevadorDocument = await this.elevadorSchema.findOne( query as FilterQuery<IElevadorPersistence & Document>);
        
        return !!elevadorDocument === true;
        
    }

    public async save(elevador: Elevador): Promise<Elevador>{
        const query = { domainId: elevador.id.toString()}; 

        const elevadorDocument = await this.elevadorSchema.findOne(query);

        try{
            if (elevadorDocument === null){
                const rawElevador: any = ElevadorMap.toPersistence(elevador)

                const elevadorCreated = await this.elevadorSchema.create(rawElevador);

                return ElevadorMap.toDomain(elevadorCreated);
            }else{
                elevadorDocument.id = elevador.id;
                await elevadorDocument.save();
                return elevador;
            }
        }catch (err){
            throw err;
        }
    }

    public async findByDomainId(idElevador: IdElevador | number): Promise<Elevador>{
        const query = {domainId: IdElevador};
        const elevadorRecord = await this.elevadorSchema.findOne( query as FilterQuery<IElevadorPersistence & Document>);

        if (elevadorRecord != null){
            return ElevadorMap.toDomain(elevadorRecord);
        }else{
            return null;
        }
    }
}