/* eslint-disable */
import {
	NOVICE_GUIDE_START,
	noviceGuideStart,
	NOVICE_GUIDE_END,
	noviceGuideEnd,
	TOOLBAR_PROMPT_START,
	toolbarPromptStart,
	TOOLBAR_PROMPT_END,
	toolbarPromptEnd,
} from 'actions/ui/noviceGuide';

describe('noviceGuide actions', () => {
	it('novice Guide Start', () => {
		const expectedAction = {
			type: NOVICE_GUIDE_START,
		};
		expect(noviceGuideStart()).toEqual(expectedAction);
	});

	it('novice Guide End', () => {
		const expectedAction = {
			type: NOVICE_GUIDE_END,
		};
		expect(noviceGuideEnd()).toEqual(expectedAction);
	});

	it('toolbar Prompt Start', () => {
		const expectedAction = {
			type: TOOLBAR_PROMPT_START,
		};
		expect(toolbarPromptStart()).toEqual(expectedAction);
	});

	it('toolbar Prompt End', () => {
		const expectedAction = {
			type: TOOLBAR_PROMPT_END,
		};
		expect(toolbarPromptEnd()).toEqual(expectedAction);
	});
});
