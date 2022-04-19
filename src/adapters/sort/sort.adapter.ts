import { Knex } from 'knex';

const sortAdapter: Function = (
  knexConnection: Knex.QueryBuilder,
  fieldIdentifier: string,
  direction: string
): Knex.QueryBuilder => {
  return knexConnection.orderBy(fieldIdentifier, direction);
};

export default sortAdapter;