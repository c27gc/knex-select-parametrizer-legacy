import { Knex } from 'knex';
import { ISort } from '../types/types';

import notSortAdapter from '../adapters/sort/notSort.adapter';
import sortAdapter from '../adapters/sort/sort.adapter';

const sortBuilder: Function = (knexConnection: Knex.QueryBuilder, sort: ISort | undefined): Knex.QueryBuilder => {
  if (sort) {
    return sortAdapter(knexConnection, sort.fieldIdentifier, sort.direction);
  } else {
    return notSortAdapter(knexConnection);
  }
}

export default sortBuilder;