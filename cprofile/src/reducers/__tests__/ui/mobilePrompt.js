/* eslint-disable */
import reducer from 'reducers/ui/mobilePrompt';
import Immutable from 'immutable';
import {
	MOBILE_PROMPT_OPEN,
	MOBILE_PROMPT_CLOSE,
} from 'actions/ui/mobilePrompt';

describe('Mobile Prompt 操作', () => {
	test('打開手機版提示', () => {
		const action = {
			type: MOBILE_PROMPT_OPEN,
		};
		expect(reducer(undefined, action)).toEqual(
			Immutable.fromJS({
				visible: true,
			})
		);
	});

	test('關閉手機版提示', () => {
		const action = {
			type: MOBILE_PROMPT_CLOSE,
		};
		expect(reducer(undefined, action)).toEqual(
			Immutable.fromJS({
				visible: false,
			})
		);
	});
});
