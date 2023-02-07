/* eslint-disable */
import {
	PROFILE_DRAWER_OPEN,
	profileDrawerOpen,
	PROFILE_DRAWER_CLOSE,
	profileDrawerClose,
} from 'actions/ui/profileDrawer';

describe('profile Drawer actions', () => {
	it('profile Drawer Open', () => {
		const expectedAction = {
			type: PROFILE_DRAWER_OPEN,
		};
		expect(profileDrawerOpen()).toEqual(expectedAction);
	});

	it('profile Drawer Close', () => {
		const expectedAction = {
			type: PROFILE_DRAWER_CLOSE,
		};
		expect(profileDrawerClose()).toEqual(expectedAction);
	});
});
