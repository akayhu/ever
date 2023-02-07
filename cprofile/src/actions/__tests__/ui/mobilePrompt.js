/* eslint-disable */
import {
	MOBILE_PROMPT_OPEN,
	mobilePromptOpen,
	MOBILE_PROMPT_CLOSE,
	mobilePromptClose,
} from 'actions/ui/mobilePrompt';

describe('mobilePrompt actions', () => {
	it('mobile Prompt Open', () => {
		const expectedAction = {
			type: MOBILE_PROMPT_OPEN,
		};
		expect(mobilePromptOpen()).toEqual(expectedAction);
	});

	it('mobile Prompt Close', () => {
		const expectedAction = {
			type: MOBILE_PROMPT_CLOSE,
		};
		expect(mobilePromptClose()).toEqual(expectedAction);
	});
});
