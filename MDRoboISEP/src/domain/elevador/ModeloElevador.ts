import { ValueObject } from "../../core/domain/ValueObject";
import { Guard } from "../../core/logic/Guard";
import { Result } from "../../core/logic/Result";

interface ModeloElvadorProps{
    modelo : string; 
}

export class ModeloElvador extends ValueObject<ModeloElvadorProps>{
    private constructor (props : ModeloElvadorProps) {
        super(props)
    }

    public static create(modelo : string): Result<ModeloElvador>{
        
        let guardResults : any[] = [];
        guardResults.push(Guard.stringLengthLessOrEqualThan(modelo,50,"Modelo do elevador"));
        guardResults.push(Guard.isAlphanumeric(modelo,"Modelo do elevador"));
        
        const finalGuard = Guard.combine(guardResults);

        if (!finalGuard.succeeded) {
            return Result.fail<ModeloElvador>(finalGuard.message);
        } else {
            return Result.ok<ModeloElvador>(new ModeloElvador({ modelo : modelo}))
        }
    }
}