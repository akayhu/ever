/* eslint-disable */
import { INIT_PREVIEW, initPreview } from 'actions/ui/preview';

describe('preview actions', () => {
	it('init Preview', () => {
		const expectedAction = {
			type: INIT_PREVIEW,
		};
		expect(initPreview()).toEqual(expectedAction);
	});
});
