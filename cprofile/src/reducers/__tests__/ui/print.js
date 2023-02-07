/* eslint-disable */
import reducer from 'reducers/ui/print';
import { PRINT_START, PRINT_END } from 'actions/ui/print';
import Immutable from 'immutable';

describe('下載列印操作', () => {
	test('下載列印打開', () => {
		const action = {
			type: PRINT_START,
			el: '列印內容',
		};
		expect(reducer(undefined, action)).toEqual(
			Immutable.fromJS({
				printStart: true,
				printData: '列印內容',
			})
		);
	});

	test('下載列印關閉', () => {
		const action = {
			type: PRINT_END,
		};
		expect(reducer(undefined, action)).toEqual(
			Immutable.fromJS({
				printStart: false,
				printData: '',
			})
		);
	});
});
