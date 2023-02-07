import _ from 'lodash';

// based on redux's compose
const compose = (...funcs) => {
	if (funcs.length === 0) return arg => arg;

	if (funcs.length === 1) return funcs[0];

	const last = _.last(funcs);
	const rest = _.initial(funcs);
	return (...args) =>
		_.reduceRight(rest, (composed, f) => f(composed), last(...args));
};

const parseArgsToArray = args => {
	if (args.length === 0) return [];

	return _.map(args, arg => {
		if (_.isFunction(arg)) return arg;
		if (_.isArray(arg)) {
			arg = _.map(arg, item => (item === '_' ? _ : item));
			return _.partial.apply(null, arg);
		}
		throw new Error(
			'you should pass arrays that contain function or functions as parameters'
		);
	});
};

export default (...parameters) => compose(...parseArgsToArray(parameters));

/*
//  import compose from './compose';
//  const sum = (a, b, c) => a + b + c;
//  const multiply = a => b => a * b;
//
//  const composed = compose(multiply(3), [sum, 1, _, 4])
*/

export const mapping = func => reducing => (result, input) =>
	reducing(result, func(input));
export const filtering = test => reducing => (result, input) =>
	test(input) ? reducing(result, input) : result;

// same as bellow
// export function mapping (func) {
//   return function mapReducer(reducing) {
//     return (result, input) => reducing(result, func(input));
//   }
// }

// export function filtering (test) {
//   return function filterReducer(reducing) {
//     return (result, input) => test(input) ? reducing(result, input) : result;
//   }
// }
//

// example
// const chain = compose(
//   mapping((x) => x + 1),
//   filtering((x) => x % 2 === 0)
//   );

// [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
//   .reduce(chain((xs, x) => {
//     xs.push(x);
//     return xs;
//   }), []);
// [2,4,6,8,10]
