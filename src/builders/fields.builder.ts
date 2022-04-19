import { Knex } from 'knex';

const fieldsBuilder = (knexConnection: Knex.QueryBuilder, fields: string[]) => {
  return knexConnection.select(fields.map(field => {
    return field;
  }));
}

export default fieldsBuilder;