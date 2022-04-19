import { Knex } from 'knex';
import { Filter } from '../../types/types';

const rangeOperatorAdapter: Function = (knexOperator: Knex.QueryBuilder, filter: Filter): Knex.QueryBuilder => {
  if (filter.operator === 'between') {
    return knexOperator.whereBetween(filter.fieldIdentifier, filter.value);
  } else if (filter.operator === 'notBetween') {
    return knexOperator.whereNotBetween(filter.fieldIdentifier, filter.value);
  } else if (filter.operator === 'in') {
    return knexOperator.whereIn(filter.fieldIdentifier, filter.value);
  } else if (filter.operator === 'notIn') {
    return knexOperator.whereNotIn(filter.fieldIdentifier, filter.value);
  } else {
    throw new Error('Operator not supported');
  }
};

export default rangeOperatorAdapter;