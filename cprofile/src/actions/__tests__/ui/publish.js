/* eslint-disable */
import { startPublishProcess, START_PUBLISH_PROCESS } from 'actions/ui/publish';

describe('publish actions', () => {
	it('start Publish Process', () => {
		const expectedAction = {
			type: START_PUBLISH_PROCESS,
		};
		expect(startPublishProcess()).toEqual(expectedAction);
	});
});
