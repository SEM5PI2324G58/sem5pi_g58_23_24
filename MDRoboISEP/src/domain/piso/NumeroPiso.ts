import { ValueObject } from "../../core/domain/ValueObject"
import { Result } from "../../core/logic/Result";

interface numeroPisoProps {
    nPiso: number ;
}

export class NumeroPiso extends ValueObject<numeroPisoProps> {
    private constructor (props : numeroPisoProps) {
        super(props)
    }

    public static create (nPiso: number): Result<NumeroPiso> {
        return Result.ok<NumeroPiso>(new NumeroPiso({ nPiso: nPiso}))
    }

}