/* eslint-disable */
import { HAS_PLUS_ACTIVITY, hasPlusActivity } from 'actions/ui/plusActivity';

describe('plusActivity actions', () => {
	it('has Plus Activity', () => {
		const expectedAction = {
			type: HAS_PLUS_ACTIVITY,
		};
		expect(hasPlusActivity()).toEqual(expectedAction);
	});
});
