/* eslint-disable */
import { PRINT_START, printStart, PRINT_END, printEnd } from 'actions/ui/print';

describe('print actions', () => {
	it('print Start', () => {
		const el = 'test';
		const expectedAction = {
			type: PRINT_START,
			el,
		};
		expect(printStart(el)).toEqual(expectedAction);
	});

	it('print Start', () => {
		const expectedAction = {
			type: PRINT_END,
		};
		expect(printEnd()).toEqual(expectedAction);
	});
});
