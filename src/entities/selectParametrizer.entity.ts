import { QueryResponse, Filters, Filter, ISort, IPagination, IQueryParameters, IFieldMapping, IOptional } from '../types/types';
import { Knex } from 'knex';
import filterBuilder from '../builders/filter.builder';
import sortBuilder from '../builders/sort.builder';
import paginationBuilder from '../builders/pagination.builder';
import fieldsBuilder from '../builders/fields.builder';
import FieldModifier from '../modifiers/fields.modifier';

export default class SelectRequestParametrizer<Type> {
  public knexConnection: Knex.QueryBuilder;
  private fields: string[];
  private initialFields: string[] | undefined;
  private filters: Filters;
  private sort: ISort | undefined;
  private pagination: IPagination | undefined;
  private count: boolean | undefined;
  private optional: IOptional | undefined;
  private aggregateFunction: Knex.Raw | undefined;
  // fieldMapping: IFieldMapping;

  constructor(queryParameters: IQueryParameters, knexConnection: Knex.QueryBuilder, optional?: IOptional) {
    this.knexConnection = knexConnection;
    this.optional = optional;
    this.aggregateFunction = optional?.aggregateFunction;

    if (optional && optional.strictFields && !optional.fieldMapping) {
      throw new Error('Field mapping { optional.fieldMapping } is required when strict fields are used');
    }
    
    if (optional && !queryParameters.fields && optional.aggregateFunction) {
      throw new Error('Fields { queryParameters.fields } are required when aggregate data is used');
    }

    // if (optional && optional.aggregateFunction && (!optional.groupBy )) {
    //   throw new Error('Group by { optional.groupBy } is required when aggregate data is used');
    // }

    if (optional && optional.groupBy && !optional.aggregateFunction) {
      throw new Error('Aggregate data { optional.aggregateData } is required when group by is used');
    }


    this.fields = this.fieldAssignment(queryParameters, optional && optional.fieldMapping);
    this.filters = this.filterAssignment(queryParameters, optional && optional.fieldMapping);
    this.sort = queryParameters.sort;
    this.pagination = queryParameters.pagination;
    this.count = queryParameters.count;
  }

  fieldAssignment(queryParameters: IQueryParameters, fieldMapping?: IFieldMapping): string[] {
    let result: string[];

    if (!queryParameters.fields) {
      this.initialFields = undefined;
      result = ['*'];
    } else if (!fieldMapping) {
      this.initialFields = queryParameters.fields;
      result = queryParameters.fields;
    } else {
      this.initialFields = queryParameters.fields;
      const fieldModifier =  new FieldModifier(queryParameters.fields, fieldMapping, this.optional && this.optional.strictFields );
      result = fieldModifier.execute();
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

  getFields(): string[] {
    return this.initialFields ?  this.initialFields.reduce( ( accumulate: any, current: string ) => {
      const cleanField = current.replace(/\s+/g, ' ').trim();

      if ( cleanField.includes(' as ')) {
        accumulate[cleanField.split(' as ')[0]] = cleanField.split(' as ')[1];
      } else {
        accumulate[cleanField] = cleanField;
      }

      return accumulate
    }, {}) : undefined;
  }

  async run(): Promise< QueryResponse<Type> > {
    let numberOfElements;
    let result: QueryResponse<Type>

    if (this.count) {
      numberOfElements = await filterBuilder(this.knexConnection, this.filters).clone().select().count();
    }

    const knexConnection = fieldsBuilder(this.knexConnection, this.fields, this.aggregateFunction);

    const filteredKnexConnection = filterBuilder(knexConnection, this.filters);

    let sortedKnexConnection = sortBuilder(filteredKnexConnection, this.sort);

    if( this.aggregateFunction ) {
      const cleanFields = this.fields.map( field => {
        const standardField = field.replace(/\s+/g, ' ').trim()
        if ( standardField.includes(' as ')) {
          return standardField.split(' as ')[0];
        } else {
          return standardField;
        }
      })
      sortedKnexConnection = sortedKnexConnection.groupBy(cleanFields);
    }

    const paginatedKnexConnection: Type[] = await paginationBuilder(sortedKnexConnection, this.pagination);

    if (this.count) {
      result = { data: paginatedKnexConnection, numberOfElements: numberOfElements[0].count };
    } else {
      result = { data: paginatedKnexConnection };
    }

    return result;
  }
}
