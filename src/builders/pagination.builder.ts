import { Knex } from 'knex';
import { IPagination } from '../types/types';

import paginateAdapter from '../adapters/paginate/paginated.adapter';
import notPaginateAdapter from '../adapters/paginate/notPaginated.adapter';

const paginationBuilder: Function = ( knexConnection: Knex.QueryBuilder, pagination: IPagination | undefined ): Promise<Knex.QueryBuilder> => {
  if (pagination) {
    return paginateAdapter(knexConnection, pagination.limit, pagination.offset);
  } else {
    return notPaginateAdapter(knexConnection);
  }
}

export default paginationBuilder;