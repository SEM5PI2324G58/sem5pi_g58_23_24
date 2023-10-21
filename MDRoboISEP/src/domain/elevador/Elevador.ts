import { AggregateRoot } from "../../core/domain/AggregateRoot";
import { UniqueEntityID } from "../../core/domain/UniqueEntityID";
import { Guard } from "../../core/logic/Guard";
import { Result } from "../../core/logic/Result";
import { Edificio } from "../edificio/Edificio";
import { Piso } from "../piso/Piso";
import { DescricaoElvador } from "./DescricaoElevador";
import { IdElevador } from "./IdElevador";
import { MarcaElvador } from "./MarcaElevador";
import { ModeloElvador } from "./ModeloElevador";
import { NumeroSerieElevador } from "./NumeroSerieElevador";

interface ElevadorProps{
    pisosServidos: Piso[];
    marca: MarcaElvador;
    modelo: ModeloElvador;
    numeroSerie: NumeroSerieElevador;
    descricao: DescricaoElvador;
}

export class Elevador extends AggregateRoot<ElevadorProps>{
    public returnIdElevador() : number{
        return Number(this._id.toValue());
    }
    public returnPisosServidos() : number[]{
        let ids: number[] = [];
        for (let i = 0; i < this.props.pisosServidos.length; i++){
            ids[i] = Number(this.props.pisosServidos[i].id.toValue())
        }
        return ids;
    }
    public returnMarca() : string{
        return this.props.marca.props.marca;
    }
    public returnModelo() : string{
        return this.props.modelo.props.modelo;
    }
    public returnNumeroSerie() : string{
        return this.props.numeroSerie.props.numeroSerie;
    }
    public returnDescricao(): string {
        return this.props.descricao.props.descricao;
    }
    private constructor (props: ElevadorProps, id: IdElevador){
        super(props,id);
    }

    public static create (props: ElevadorProps, id: IdElevador) : Result<Elevador> {

        const guardedProps = [
            {argument: props.pisosServidos, argumentName: 'Lista de pisos servidos' },
            {argument: props.marca, argumentName: 'Marca do elevador' },
            {argument: props.modelo, argumentName: 'Modelo do elevador' },
            {argument: props.numeroSerie, argumentName: 'Número de série do elevador' },
            {argument: props.descricao, argumentName: 'Descrição do elevador' },
        ]

        let guardResults : any[] = [];
        
        guardResults.push(Guard.againstNullOrUndefined(guardedProps[0].argument,guardedProps[0].argumentName));
        guardResults.push(Guard.arrayHasGreaterLengthThan(guardedProps[0].argument as any[],1,guardedProps[0].argumentName));
        

        const finalGuard = Guard.combine(guardResults);

        if (!finalGuard.succeeded) {
            return Result.fail<Elevador>(finalGuard.message)
        }     
        else {
            const elevador = new Elevador({
                ...props
            }, id);

            return Result.ok<Elevador>(elevador);
        }
    }
}