import { INumberFilter, IRangeNumberFilter, IStringFilter, IRangeStringFilter } from '../types/types';

export const isINumberFilter: Function = (objectInstance: any): objectInstance is INumberFilter => {
  return objectInstance && objectInstance.value && typeof objectInstance.value === 'number';
};

export const isIRangeNumberFilter: Function = (objectInstance: any): objectInstance is IRangeNumberFilter => {
  return objectInstance && Array.isArray(objectInstance.value) && objectInstance.value.length === 2;
};

export const isIRangeStringFilter: Function = (objectInstance: any): objectInstance is IRangeStringFilter => {
  return objectInstance && Array.isArray(objectInstance.value) && objectInstance.value.length === 2;
};

export const isIStringFilter: Function = (objectInstance: any): objectInstance is IStringFilter => {
  return objectInstance && objectInstance.value && typeof objectInstance.value === 'string';
};