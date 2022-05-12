import { Knex } from 'knex';

const fieldsBuilder = (knexConnection: Knex.QueryBuilder, fields: string[], aggregateFunction?: Knex.Raw) => {
  let modifiedFields: (string | Knex.Raw)[] = aggregateFunction ? [...fields, ...[aggregateFunction] ]: fields;

  return knexConnection.select(modifiedFields.map(field => {
    return field;
  }));
}

export default fieldsBuilder;

