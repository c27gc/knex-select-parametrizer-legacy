import { IFilter, INumberFilter, IRangeNumberFilter, IStringFilter, IRangeStringFilter } from '../types/types';
//import fs from 'fs'
//import YAML from 'yaml'

import VariableValidator from './variable.validator';

//const operatorValidValues = YAML.parse(fs.readFileSync('../config/operatorValidValues.yml', 'utf8'))

export const isINumberFilter: Function = (objectInstance: any): objectInstance is INumberFilter => {

  const objectValidator: VariableValidator = new VariableValidator(objectInstance);
  
  objectValidator.addPropertyValidation('fieldIdentifier', 'string');

  objectValidator.addPropertyValidation('value', 'number');

  objectValidator.addPropertyValidation('operator', 'string', undefined, (property: string) => {
    return ['<', '<=', '>', '>=', '=', '!='].includes(property);
  });
  
  return objectValidator.validate();
};

export const isIRangeNumberFilter: Function = (objectInstance: any): objectInstance is IRangeNumberFilter => {
  
  const objectValidator : VariableValidator = new VariableValidator(objectInstance);

  objectValidator.addPropertyValidation('fieldIdentifier', 'string');

  objectValidator.addPropertyValidation('value', 'array', undefined, (property: any) => {
    return property.length === 2 && property.every((value: any) => typeof value === 'number');
  })

  objectValidator.addPropertyValidation('operator', 'string', undefined, (property: string) => {
    return ['between', 'notBetween', 'in', 'notIn'].includes(property);
  });

  return objectValidator.validate();
};

export const isIRangeStringFilter: Function = (objectInstance: any): objectInstance is IRangeStringFilter => {

  const objectValidator: VariableValidator = new VariableValidator(objectInstance);

  objectValidator.addPropertyValidation('fieldIdentifier', 'string');

  objectValidator.addPropertyValidation('value', 'array', undefined, (property: any) => {
    return property.length === 2 && property.every((value: any) => typeof value === 'string');
  });

  objectValidator.addPropertyValidation('operator', 'string', undefined, (property: string) => {
    return ['between', 'notBetween', 'in', 'notIn'].includes(property);
  });

  return objectValidator.validate();
};

export const isIStringFilter: Function = (objectInstance: any): objectInstance is IStringFilter => {

  const objectValidator: VariableValidator = new VariableValidator(objectInstance);

  objectValidator.addPropertyValidation('fieldIdentifier', 'string');

  objectValidator.addPropertyValidation('value', 'string');

  objectValidator.addPropertyValidation('operator', 'string', undefined, (property: string) => {
    return ['like', 'ilike', 'notLike', 'isNull', 'isNotNull'].includes(property);
  });

  return objectValidator.validate();
};

export const isIFilter = (obj: any): obj is IFilter => {
  return obj.fieldIdentifier !== undefined && obj.operator !== undefined && obj.value !== undefined;
}
