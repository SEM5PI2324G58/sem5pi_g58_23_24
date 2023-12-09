
export interface IGuardResult {
  succeeded: boolean;
  message?: string;
}

export interface IGuardArgument {
  argument: any;
  argumentName: string;
}

export type GuardArgumentCollection = IGuardArgument[];

export class Guard {

  public static combine(guardResults: IGuardResult[]): IGuardResult {
    for (let result of guardResults) {
      if (result.succeeded === false) return result;
    }

    return { succeeded: true };
  }

  public static againstNullOrUndefined(argument: any, argumentName: string): IGuardResult {
    if (argument === null || argument === undefined) {
      return { succeeded: false, message: `${argumentName} is null or undefined` }
    } else {
      return { succeeded: true }
    }
  }

  public static againstNullOrUndefinedBulk(args: GuardArgumentCollection): IGuardResult {
    for (let arg of args) {
      const result = this.againstNullOrUndefined(arg.argument, arg.argumentName);
      if (!result.succeeded) return result;
    }

    return { succeeded: true }
  }

  public static isOneOf(value: any, validValues: any[], argumentName: string): IGuardResult {
    let isValid = false;
    for (let validValue of validValues) {
      if (value === validValue) {
        isValid = true;
      }
    }

    if (isValid) {
      return { succeeded: true }
    } else {
      return {
        succeeded: false,
        message: `${argumentName} isn't oneOf the correct types in ${JSON.stringify(validValues)}. Got "${value}".`
      }
    }
  }

  public static inRange(num: number, min: number, max: number, argumentName: string): IGuardResult {
    const isInRange = num >= min && num <= max;
    if (!isInRange) {
      return { succeeded: false, message: `${argumentName} is not within range ${min} to ${max}.` }
    } else {
      return { succeeded: true }
    }
  }

  public static allInRange(numbers: number[], min: number, max: number, argumentName: string): IGuardResult {
    let failingResult: IGuardResult = null;
    for (let num of numbers) {
      const numIsInRangeResult = this.inRange(num, min, max, argumentName);
      if (!numIsInRangeResult.succeeded) failingResult = numIsInRangeResult;
    }

    if (failingResult) {
      return { succeeded: false, message: `${argumentName} is not within the range.` }
    } else {
      return { succeeded: true }
    }
  }

/**
 * Validates a number to be greater than zero.
 * @param num 
 * @param argumentName 
 * @returns 
 */
  public static numberGreaterThanZero(num: number, argumentName: string): IGuardResult {
    if (num > 0) {
      return { succeeded: true };
    } else {
      return { succeeded: false, message: `${argumentName} must be greater than 0.` };
    }
  }


  /**
   * Validates a string to be a valid email address. A valid email address is a string containing an @ symbol, followed by a domain name and a top-level domain.
   * @param email 
   * @param argumentName 
   * @returns 
   */
  public static againtInvalidEmail(email: string, argumentName: string): IGuardResult {
    const regEx = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // taken from https://www.w3resource.com/javascript/form/email-validation.php

    if (regEx.test(email)) {
      return { succeeded: true }
    } else {
      return { succeeded: false, message: `${argumentName} is not a valid email address.` }
    }
  }

  /**
   *  Validates a string to be a valid phone number format. A valid phone number is a string containing only numbers, spaces, dashes, dots and parentheses. 
   * @param input 
   * @param fieldName 
   * @returns 
   */
  public static againstInvalidPhoneFormat(input: string, fieldName: string): IGuardResult {
    const phoneRegex = /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g; // regex from https://stackoverflow.com/questions/4338267/validate-phone-number-with-javascript

    if (!phoneRegex.test(input)) {
      return { succeeded: false, message: `${fieldName} is not a valid phone number format.` };
    }

    return { succeeded: true };
  }

  /**
   * Validates a string to be a valid username. A valid username is a string with at least 2 characters and at most 30 characters, containing only letters and spaces.
   * @param input 
   * @param fieldName 
   * @returns 
   */
  public static againstInvalidUsername(input: string, fieldName: string): IGuardResult {
    const usernameRegex = /^[a-zA-Z ]{2,30}$/;

    if (!usernameRegex.test(input)) {
      return { succeeded: false, message: `${fieldName} is not a valid username.` };
    }

    return { succeeded: true };
  }

  /**
   *  Validates a portuguese NIF (Número de Identificação Fiscal). Inspired by https://gist.github.com/eresende/88562d2c4dc85b62cb0c
   * @param nif A string containing the NIF to validate
   * @param fieldName A string that will be used in the error message
   * @returns 
   */
  public static againstInvalidNIF(nif: string, fieldName: string): IGuardResult { 
    if (nif.length !== 9 || !/^[0-9]+$/.test(nif)) {
      return { succeeded: false, message: `${fieldName} must be a 9 digit number.` };
    }

    /*const validStartDigits = ['1', '2', '3', '5', '6', '8', '45', '70', '71', '72', '77', '79', '90', '91', '98', '99'];
    if (!validStartDigits.some(d => nif.startsWith(d))) {
      return { succeeded: false, message: `${fieldName} does not start with a valid digit sequence.` };
    }

    const total = [...nif].slice(0, 8).reduce((acc, curr, i) => acc + parseInt(curr) * (9 - i), 0);
    const modulo11 = total % 11;
    const comparador = modulo11 < 2 ? 0 : 11 - modulo11;
    const ultimoDigito = parseInt(nif.charAt(8));

    if (ultimoDigito !== comparador) {
      return { succeeded: false, message: `The last digit of ${fieldName} does not satisfy the checksum.` };
    }*/

    return { succeeded: true };
  }

}