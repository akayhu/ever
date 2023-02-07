/* eslint-disable */
import reducer from 'reducers/ui/profileDrawer';
import {
	PROFILE_DRAWER_OPEN,
	PROFILE_DRAWER_CLOSE,
} from 'actions/ui/profileDrawer';
import Immutable from 'immutable';

describe('Profile Drawer 操作', () => {
	test('打開個人頁抽屜', () => {
		const action = {
			type: PROFILE_DRAWER_OPEN,
		};
		expect(reducer(undefined, action)).toEqual(
			Immutable.fromJS({
				visible: true,
			})
		);
	});

	test('關閉個人頁抽屜', () => {
		const action = {
			type: PROFILE_DRAWER_CLOSE,
		};
		expect(reducer(undefined, action)).toEqual(
			Immutable.fromJS({
				visible: false,
			})
		);
	});
});
