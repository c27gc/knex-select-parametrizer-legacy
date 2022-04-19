export interface IFilter {
  fieldIdentifier: string;
  operator: string;
  value: string | number | number[] | string[];
}

export interface INumberFilter extends IFilter {
  fieldIdentifier: string;
  operator: '<' | '<=' | '>' | '>=' | '=' | '!=';
  value: number;
}

export interface IRangeNumberFilter extends IFilter {
  fieldIdentifier: string;
  operator: 'between' | 'notBetween' | 'in' | 'notIn';
  value: [number, number];
}

export interface IRangeStringFilter extends IFilter {
  fieldIdentifier: string;
  operator: 'between' | 'notBetween' | 'in' | 'notIn';
  value: [string, string];
}

export interface IStringFilter extends IFilter {
  fieldIdentifier: string;
  operator: 'like' | 'ilike' | 'notLike' | 'isNull' | 'isNotNull';
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
  fields: string[] | '*';
  filters?: Filters;
  sort?: ISort;
  pagination?: IPagination;
  count?: boolean;
}

export interface IFieldMapping {
  [key: string]: string;
}