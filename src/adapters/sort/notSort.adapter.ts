import { Knex } from 'knex';

const notSortAdapter: Function = (knexConnection: Knex.QueryBuilder): Knex.QueryBuilder => {
  return knexConnection;
};

export default notSortAdapter;
