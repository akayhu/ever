/* eslint-disable */
import {
	CREATE_API_REQUEST_EPIC,
	createAPIRequestEpic,
	BYPASS_AND_PROCESS_BY_API_REQUEST_EPIC,
	bypassAndProcessByEpic,
	DELETE_API_REQUEST_EPIC,
	deleteAPIRequestEpic,
} from 'actions/processAPI';

describe('processAPI actions', () => {
	it('create API Request Epic', () => {
		const requestAction = {
			id: 7533967,
		};
		const expectedAction = {
			type: CREATE_API_REQUEST_EPIC,
			payload: requestAction,
		};
		expect(createAPIRequestEpic(requestAction)).toEqual(expectedAction);
	});

	it('bypass And Process By Epic', () => {
		const requestAction = {
			id: 7533967,
		};
		const expectedAction = {
			type: BYPASS_AND_PROCESS_BY_API_REQUEST_EPIC,
			payload: requestAction,
		};
		expect(bypassAndProcessByEpic(requestAction)).toEqual(expectedAction);
	});

	it('delete API Request Epic', () => {
		const requestAction = {
			id: 7533967,
		};
		const expectedAction = {
			type: DELETE_API_REQUEST_EPIC,
			payload: requestAction,
		};
		expect(deleteAPIRequestEpic(requestAction)).toEqual(expectedAction);
	});
});
