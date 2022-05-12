import { InvalidInputObject, InvalidPropertyType } from '../errors/errors';

import { ValidationDataTypes, IValidation } from '../types/types';

export default class VariableValidator {
  private inputObject : any;
  private propertiesValidations : IValidation[] = [];

  constructor(inputObject : any ) {
    if ( inputObject ) {
      this.inputObject = inputObject;
    } else {
      throw new InvalidInputObject("The input object is not valid, it can not be null or undefined");
    }
  }

  addPropertyValidation(propertyName : string, propertyType: ValidationDataTypes, propertyValue?: any, aditionalValidation?: Function) {
    let validate: boolean = true;

    //This stage validates if the property exits
    validate = validate && this.inputObject[propertyName];

    //This stage validates if the property is of the correct type
    if (propertyType == 'string' || propertyType == "number" || propertyType == "boolean" || propertyType == "undefined" ) {
      if ( propertyType === "number") {
        validate = /^[+-]?\d+(\.\d+)?$/.test(this.inputObject[propertyName]);
      } else {
        validate = validate && (typeof this.inputObject[propertyName] === propertyType);
      }
    } else if ( propertyType == "array") {
      validate = validate && Array.isArray(this.inputObject[propertyName]);
    } else if ( propertyType == "object") {
      validate = validate && (typeof this.inputObject[propertyName] === "object");
    } else {
      throw new InvalidPropertyType(`The property type ${propertyType} is not valid.`);
    }

    //This stage validates if the property value is the correct one
    if (propertyValue) {
      validate = validate && (this.inputObject[propertyName] === propertyValue);
    }

    //This stage validates if the property has the correct aditional validations
    if (aditionalValidation) {
      validate = validate && aditionalValidation(this.inputObject[propertyName]);
    }

    const validation : IValidation = {
      propertyName: propertyName,
      isValid: validate
    }

    this.propertiesValidations.push(validation);

  }

  validate() {
    let isValid : boolean = true;
    this.propertiesValidations.forEach( (validation : IValidation) => {
      isValid = isValid && validation.isValid;
    });

    return isValid;
  }
    
  
}
