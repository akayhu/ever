/* eslint-disable */
import { TRIGGER_SURVEY, triggerSurvey } from 'actions/ui/survey';

describe('triggerSurvey actions', () => {
	it('trigger Survey', () => {
		const expectedAction = {
			type: TRIGGER_SURVEY,
		};
		expect(triggerSurvey()).toEqual(expectedAction);
	});
});
