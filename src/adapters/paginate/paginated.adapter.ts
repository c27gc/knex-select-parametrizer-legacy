import { Knex } from 'knex';

const paginateAdapter: Function = async (
  knexConnection: Knex.QueryBuilder,
  limit: number,
  offset: number
): Promise<Knex.QueryBuilder> => {
  return knexConnection.limit(limit).offset(offset);
};

export default paginateAdapter;