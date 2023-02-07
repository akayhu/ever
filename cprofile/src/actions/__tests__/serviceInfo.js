/* eslint-disable */
import { CHANGE_STATUS, changeStatus } from 'actions/serviceInfo';

describe('serviceInfo actions', () => {
	it('change Status', () => {
		const status = true;
		const expectedAction = {
			type: CHANGE_STATUS,
			payload: status,
		};
		expect(changeStatus(status)).toEqual(expectedAction);
	});
});
