import { Knex } from 'knex';
import { Filters, Filter } from '../types/types';

import {
  isINumberFilter,
  isIRangeNumberFilter,
  isIStringFilter,
  isIRangeStringFilter
} from '../validators/interfaces.validators';

import rangeOperatorAdapter from '../adapters/filters/rangeOperator.adapter';

import simpleStringOperatorAdapter from '../adapters/filters/simpleStringOperator.adapter';

import simpleNumberOperatorAdapter from '../adapters/filters/simpleNumberOperator.adapter';

const filterBuilder: Function = (knexConnection: Knex.QueryBuilder, filters: Filters): Knex.QueryBuilder => {
  return filters.reduce((accumulate: Knex.QueryBuilder, current: Filter) => {
    if (isINumberFilter(current)) {
      return simpleNumberOperatorAdapter(accumulate, current);
    } else if (isIRangeNumberFilter(current)) {
      return rangeOperatorAdapter(accumulate, current);
    } else if (isIStringFilter(current)) {
      return simpleStringOperatorAdapter(accumulate, current);
    } else if (isIRangeStringFilter(current)) {
      return rangeOperatorAdapter(accumulate, current);
    } else {
      throw new Error('Invalid filter');
    }
  }, knexConnection);
};

export default filterBuilder;
