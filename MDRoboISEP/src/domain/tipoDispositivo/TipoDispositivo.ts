import { UniqueEntityID } from "../../core/domain/UniqueEntityID";
import { AggregateRoot } from "../../core/domain/AggregateRoot";
import { Guard } from "../../core/logic/Guard";
import { Result } from "../../core/logic/Result";
import { TipoTarefa } from "./TipoTarefa";
import { Marca } from "./Marca";
import { Modelo } from "./Modelo";

interface TipoDispositivoProps {
    tipoTarefa: TipoTarefa[];
    marca: Marca;
    modelo: Modelo;
}
export class TipoDispositivo extends AggregateRoot<TipoDispositivoProps>{
    private constructor(props: TipoDispositivoProps, id: UniqueEntityID) {
        super(props, id);
    }

    public returnMarca(): string{
        return this.props.marca.props.marca;
    }

    public returnModelo(): string{
        return this.props.modelo.props.modelo;
    }
    public returnTipoTarefa(): string[] {
        let tipoTarefa: string[] = [];
        for(let i = 0; i < this.props.tipoTarefa.length; i++){
            tipoTarefa.push(this.props.tipoTarefa[i].props.tipoTarefa);
        }
        return tipoTarefa;
    }

    public static create(props: TipoDispositivoProps, id: UniqueEntityID): Result<TipoDispositivo> {
        const guardedProps = [{argument: props.tipoTarefa, argumentName: 'Tipo de Tarefa'},
        {argument: props.marca, argumentName: 'Marca'},
        {argument: props.modelo, argumentName: 'Modelo'}];
        const guardResult = Guard.againstNullOrUndefinedBulk(guardedProps);
        const guardResul2 = Guard.valueRepeatedInArray(props.tipoTarefa, 'Tipo de Tarefa');
        if (!guardResult.succeeded) {
            return Result.fail<TipoDispositivo>(guardResult.message);
        }else if(!guardResul2.succeeded){
            return Result.fail<TipoDispositivo>(guardResul2.message);
        }else {
            const tipoDispositivo = new TipoDispositivo({
              ...props
            }, id);
      
            return Result.ok<TipoDispositivo>(tipoDispositivo);
        }
    }
}