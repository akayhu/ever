/* eslint-disable */
import {
	TOGGLE_REORDER_CONFIRM,
	toggleReOrderConfirm,
} from 'actions/ui/reorder';

describe('reorder actions', () => {
	it('toggle ReOrder Confirm', () => {
		const visibility = true;
		const expectedAction = {
			type: TOGGLE_REORDER_CONFIRM,
			visibility,
		};
		expect(toggleReOrderConfirm(visibility)).toEqual(expectedAction);
	});
});
