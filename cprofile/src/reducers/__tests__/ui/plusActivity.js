/* eslint-disable */
import reducer from 'reducers/ui/plusActivity';
import { HAS_PLUS_ACTIVITY } from 'actions/ui/plusActivity';
import Immutable from 'immutable';

describe('Plus 文章操作', () => {
	test('是否有文章', () => {
		const action = {
			type: HAS_PLUS_ACTIVITY,
		};
		expect(reducer(undefined, action)).toEqual(
			Immutable.fromJS({
				hasPlusActivity: true,
			})
		);
	});
});
