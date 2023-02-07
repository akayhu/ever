/* eslint-disable */
import reducer from 'reducers/ui/noviceGuide';
import {
	NOVICE_GUIDE_START,
	NOVICE_GUIDE_END,
	TOOLBAR_PROMPT_START,
	TOOLBAR_PROMPT_END,
} from 'actions/ui/noviceGuide';
import Immutable from 'immutable';

describe('新手引導操作', () => {
	test('新手引導打開', () => {
		const action = {
			type: NOVICE_GUIDE_START,
		};
		expect(reducer(undefined, action)).toEqual(
			Immutable.fromJS({
				noviceGuideStart: true,
				toolbarPromptStart: false,
			})
		);
	});

	test('新手引導關閉', () => {
		const action = {
			type: NOVICE_GUIDE_END,
		};
		expect(reducer(undefined, action)).toEqual(
			Immutable.fromJS({
				noviceGuideStart: false,
				toolbarPromptStart: false,
			})
		);
	});

	test('提醒使用者可以使用工具列開啟', () => {
		const action = {
			type: TOOLBAR_PROMPT_START,
		};
		expect(reducer(undefined, action)).toEqual(
			Immutable.fromJS({
				noviceGuideStart: false,
				toolbarPromptStart: true,
			})
		);
	});

	test('提醒使用者可以使用工具列關閉', () => {
		const action = {
			type: TOOLBAR_PROMPT_END,
		};
		expect(reducer(undefined, action)).toEqual(
			Immutable.fromJS({
				noviceGuideStart: false,
				toolbarPromptStart: false,
			})
		);
	});
});
