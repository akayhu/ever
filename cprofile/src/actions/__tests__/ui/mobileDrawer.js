/* eslint-disable */
import {
	MOBILE_DRAWER_OPEN,
	mobileDrawerOpen,
	MOBILE_DRAWER_CLOSE,
	mobileDrawerClose,
} from 'actions/ui/mobileDrawer';

describe('mobileDrawer actions', () => {
	it('mobile Drawer Open', () => {
		const expectedAction = {
			type: MOBILE_DRAWER_OPEN,
		};
		expect(mobileDrawerOpen()).toEqual(expectedAction);
	});

	it('mobile Drawer Close', () => {
		const expectedAction = {
			type: MOBILE_DRAWER_CLOSE,
		};
		expect(mobileDrawerClose()).toEqual(expectedAction);
	});
});
