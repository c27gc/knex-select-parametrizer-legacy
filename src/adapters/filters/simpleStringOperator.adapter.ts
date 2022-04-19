import { Knex } from 'knex';
import { Filter } from '../../types/types';

const simpleStringOperatorAdapter: Function = (knexOperator: Knex.QueryBuilder, filter: Filter): Knex.QueryBuilder => {
  if (filter.operator === 'like') {
    return knexOperator.where(filter.fieldIdentifier, filter.operator, filter.value);
  } else if (filter.operator === 'notLike') {
    return knexOperator.whereNot(filter.fieldIdentifier, 'like', filter.value);
  } else if (filter.operator === 'isNull') {
    return knexOperator.whereNull(filter.fieldIdentifier);
  } else if (filter.operator === 'isNotNull') {
    return knexOperator.whereNotNull(filter.fieldIdentifier);
  } else {
    throw new Error('Operator not supported');
  }
};

export default simpleStringOperatorAdapter;
