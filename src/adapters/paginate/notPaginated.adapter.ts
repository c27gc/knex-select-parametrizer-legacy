import { Knex } from 'knex';

const notPaginateAdapter: Function = (knexConnection: Knex.QueryBuilder): Knex.QueryBuilder => {
  return knexConnection;
};

export default notPaginateAdapter;
