/* eslint-disable */
import reducer from 'reducers/ui/factory';
import { CHANGE_SHOWTAG, CHANGE_BOX } from 'actions/ui/factory';
import { CHANGE_THEME } from 'actions/ui/card';
import Immutable from 'immutable';

describe('Factory 操作', () => {
	test('變更顯示tag', () => {
		const action = {
			type: CHANGE_SHOWTAG,
			tag: 'github',
		};
		expect(reducer(undefined, action)).toEqual(
			Immutable.fromJS({
				showTag: 'github',
				controlKey: 'custom',
				theme: '',
			})
		);
	});

	test('變更內容', () => {
		const action = {
			type: CHANGE_BOX,
			tag: 'behance',
		};
		expect(reducer(undefined, action)).toEqual(
			Immutable.fromJS({
				showTag: '',
				controlKey: 'behance',
				theme: '',
			})
		);
	});

	test('變換主題', () => {
		const action = {
			type: CHANGE_THEME,
			templateType: 'black',
		};
		expect(reducer(undefined, action)).toEqual(
			Immutable.fromJS({
				showTag: '',
				controlKey: 'custom',
				theme: 'black',
			})
		);
	});
});
