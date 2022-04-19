import { Filters, Filter, ISort, IPagination, IQueryParameters, IFieldMapping } from '../types/types';
import { Knex } from 'knex';

import filterBuilder from '../builders/filter.builder';
import sortBuilder from '../builders/sort.builder';
import paginationBuilder from '../builders/pagination.builder';
import fieldsBuilder from '../builders/fields.builder';

export default class SelectRequestParametrizer<Type> {
  public knexConnection: Knex.QueryBuilder;
  private fields: string[];
  private filters: Filters;
  private sort: ISort | undefined;
  private pagination: IPagination | undefined;
  private count: boolean | undefined;

  constructor(queryParameters: IQueryParameters, knexConnection: Knex.QueryBuilder, fieldMapping?: IFieldMapping) {
    this.knexConnection = knexConnection;

    this.fields = this.fieldAssignment(queryParameters, fieldMapping);
    this.filters = this.filterAssignment(queryParameters, fieldMapping);
    this.sort = queryParameters.sort;
    this.pagination = queryParameters.pagination;
    this.count = queryParameters.count;
  }

  fieldAssignment(queryParameters: IQueryParameters, fieldMapping?: IFieldMapping): string[] {
    let result: string[];

    if (queryParameters.fields === '*') {
      result = ['*'];
    } else if (!fieldMapping) {
      result = queryParameters.fields;
    } else {
      result = Object.keys(fieldMapping).reduce((accumulate: string[], current: string) => {
        const fieldClean: string = current.replace(/\s+/g, ' ').trim();

        if (fieldClean.includes(' as ')) {
          const fieldSplit: string[] = fieldClean.split(' ');
          const fieldName: string = fieldSplit[0];
          const fieldAlias: string = fieldSplit[2];

          return [...accumulate, `${fieldMapping[fieldName]} as ${fieldAlias}`];
        } else {
          return [...accumulate, `${fieldMapping[fieldClean]}`];
        }
      }, []);
    }

    return result;
  }

  filterAssignment(queryParameters: IQueryParameters, fieldMapping?: IFieldMapping): Filters {
    let result: Filters;

    if (!queryParameters.filters) {
      result = [];
    } else if (!fieldMapping) {
      result = queryParameters.filters;
    } else {
      result = queryParameters.filters.reduce((accumulate: Filters, current: Filter) => {
        return [...accumulate, { ...current, fieldIdentifier: fieldMapping[current.fieldIdentifier] }];
      }, []);
    }

    return result;
  }

  async run(): Promise<{
    data: Type[];
    numberOfElements?: number;
  }> {
    let numberOfElements;
    let result: {
      data: Type[];
      numberOfElements?: number;
    };

    if (this.count) {
      numberOfElements = await filterBuilder(this.knexConnection, this.filters).clone().select().count();
    }

    const knexConnection = fieldsBuilder(this.knexConnection, this.fields);

    const filteredKnexConnection = filterBuilder(knexConnection, this.filters);

    const sortedKnexConnection = sortBuilder(filteredKnexConnection, this.sort);

    const paginatedKnexConnection: Type[] = await paginationBuilder(sortedKnexConnection, this.pagination);

    if (this.count) {
      result = { data: paginatedKnexConnection, numberOfElements: numberOfElements[0].count };
    } else {
      result = { data: paginatedKnexConnection };
    }

    return result;
  }
}
