import { ValueObject } from "../../core/domain/ValueObject";
import { Guard } from "../../core/logic/Guard";
import { Result } from "../../core/logic/Result";

interface MarcaElvadorProps{
    marca : string; 
}

export class MarcaElvador extends ValueObject<MarcaElvadorProps>{
    private constructor (props : MarcaElvadorProps) {
        super(props)
    }

    public static create(marca : string): Result<MarcaElvador>{
        
        let guardResults : any[];
        guardResults.push(Guard.stringLengthLessOrEqualThan(marca,50,"Marca do elevador"));
        guardResults.push(Guard.isAlphanumeric(marca,"Marca do elevador"));
        
        const finalGuard = Guard.combine(guardResults);

        if (!finalGuard.succeeded) {
            return Result.fail<MarcaElvador>(finalGuard.message);
        } else {
            return Result.ok<MarcaElvador>(new MarcaElvador({ marca : marca}))
        }
    }
}