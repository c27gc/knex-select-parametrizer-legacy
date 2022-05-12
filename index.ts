import  SelectRequestParametrizer from './src/entities/selectParametrizer.entity';
export default SelectRequestParametrizer;

export * from './src/types/types';

// import SelectRequestParametrizer from './src/entities/selectParametrizer.entity';
// import knex, { Knex } from 'knex';
// import { IQueryParameters } from './src/types/types';

// const knexConnection: Knex = knex({
//   client: 'pg',
//   debug: false,
//   connection: {
//     host: 'localhost',
//     port: 54320,
//     user: 'admium',
//     password: '7yrJaY6HG2RgRnGd',
//     database: 'admium'
//   },
//   pool: { min: 0, max: 10 }
// });

// import qs from 'qs';
// import { IQueryParameters } from './src/types/types';

// const inputFilter: IQueryParameters = {
//   fields: ['group.id as group_id', 'group.name as group_name', 'user.id', 'group.id as group_id', 'first_name', 'last_name'],

//   sort: {
//     fieldIdentifier: 'group.id',
//     direction: 'asc'
//   },
//   filters: [
//     {
//       fieldIdentifier: 'first_name',
//       operator: 'like',
//       value: '%l%'
//     }
//   ],
  
//   pagination: {
//     limit: 1,
//     offset: 2
//   },
//   count: true
// };

// console.log(qs.stringify(inputFilter));


// interface IUser {
//   [key: string]: any;
// }

// const query = new SelectRequestParametrizer<IUser>(
//   inputFilter,
//   knexConnection('user').withSchema('development').innerJoin('group', 'user.group_id', 'group.id')
// );



// query.run().then(console.log).catch(console.error);
