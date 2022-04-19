import { Knex } from 'knex';
import { Filter } from '../../types/types';

const simpleNumberOperatorAdapter: Function = (knexOperator: Knex.QueryBuilder, filter: Filter): Knex.QueryBuilder => {
  return knexOperator.where(filter.fieldIdentifier, filter.operator, filter.value);
}

export default simpleNumberOperatorAdapter;