/* eslint-disable */
import reducer from 'reducers/ui/mobileDrawer';
import {
	MOBILE_DRAWER_OPEN,
	MOBILE_DRAWER_CLOSE,
} from 'actions/ui/mobileDrawer';
import Immutable from 'immutable';

describe('mobile drawer操作', () => {
	test('mobile drawer打開', () => {
		const action = {
			type: MOBILE_DRAWER_OPEN,
		};
		expect(reducer(undefined, action)).toEqual(
			Immutable.fromJS({
				visible: true,
			})
		);
	});

	test('mobile drawer 關閉', () => {
		const action = {
			type: MOBILE_DRAWER_CLOSE,
		};
		expect(reducer(undefined, action)).toEqual(
			Immutable.fromJS({
				visible: false,
			})
		);
	});
});
