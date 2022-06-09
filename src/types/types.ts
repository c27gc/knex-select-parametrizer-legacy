import { Knex } from 'knex';

export interface IFilter {
  fieldIdentifier: string;
  operator: string;
  value: string | number | number[] | string[];
}

export type NumberFilterOperators = '<' | '<=' | '>' | '>=' | '=' | '!='

export interface INumberFilter extends IFilter {
  fieldIdentifier: string;
  operator: NumberFilterOperators;
  value: number;
}

export type RangeFilterOperators = 'between' | 'notBetween' | 'in' | 'notIn'

export interface IRangeNumberFilter extends IFilter {
  fieldIdentifier: string;
  operator: RangeFilterOperators;
  value: [number, number];
}

export interface IRangeStringFilter extends IFilter {
  fieldIdentifier: string;
  operator: RangeFilterOperators;
  value: [string, string];
}

export type StringFilterOperators = 'like' | 'ilike' | 'notLike' | 'isNull' | 'isNotNull';

export interface IStringFilter extends IFilter {
  fieldIdentifier: string;
  operator: StringFilterOperators;
  value: string;
}

export type Filter = INumberFilter | IStringFilter | IRangeNumberFilter | IRangeStringFilter;

export type Filters = Filter[];

export interface ISort {
  fieldIdentifier: string;
  direction: 'asc' | 'desc';
}

export interface IPagination {
  limit: number;
  offset: number;
}

export interface IQueryParameters {
  fields?: string[];
  filters?: Filters;
  sort?: ISort;
  pagination?: IPagination;
  count?: boolean;
}

export interface IFieldMapping {
  [key: string]: string;
}

export type ValidationDataTypes = "string" | "array" | "object" | "number" | "boolean" | "undefined";

export interface IValidation {
  propertyName: string;
  isValid: boolean;
}

export type QueryResponse<Type> = {
  data: Type[];
  numberOfElements?: number;
} 

export interface IFieldMatch {
  internalAlias: string,
  externalAlias: string | undefined,
}

export interface IOptional {
  knexConnection ?: Knex;
  fieldMapping?: IFieldMapping;
  groupBy?: string[];
  strictFields?: boolean;
  aggregateFunction?: Knex.Raw;
  aggregateField?: string;
}