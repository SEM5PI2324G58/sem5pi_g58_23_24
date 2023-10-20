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
    edificio : Edificio;
    pisosServidos: Piso[];
    marca: MarcaElvador;
    modelo: ModeloElvador;
    numeroSerie: NumeroSerieElevador;
    descricao: DescricaoElvador;
}

export class Elevador extends AggregateRoot<ElevadorProps>{
    private constructor (props: ElevadorProps, id: IdElevador){
        super(props,id);
    }

    public static create (props: ElevadorProps, id: IdElevador) : Result<Elevador> {

        const guardedProps = [
            {argument: props.edificio, argumentName: 'Edifício' },
            {argument: props.pisosServidos, argumentName: 'Lista de pisos servidos' },
            {argument: props.marca, argumentName: 'Marca do elevador' },
            {argument: props.modelo, argumentName: 'Modelo do elevador' },
            {argument: props.numeroSerie, argumentName: 'Número de série do elevador' },
            {argument: props.descricao, argumentName: 'Descrição do elevador' },
        ]

        let guardResults : any[];
        guardResults.push(Guard.againstNullOrUndefined(guardedProps[0].argument,guardedProps[0].argumentName));
        guardResults.push(Guard.againstNullOrUndefined(guardedProps[1].argument,guardedProps[1].argumentName));
        guardResults.push(Guard.arrayHasGreaterLengthThan(guardedProps[1].argument as any[],1,guardedProps[1].argumentName));
        

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