import reducer from 'reducers/serviceInfo';
import { GET_RECIEVE_FETCH_SERVICE_LIGHTBOX } from 'actions/serviceInfo';

import Immutable from 'immutable';

describe(' 接收後端是否打開 preLoginService', () => {
	it('打開 preLoginService', () => {
		const action = {
			type: GET_RECIEVE_FETCH_SERVICE_LIGHTBOX,
			payload: true,
		};

		expect(reducer(undefined, action)).toEqual(
			Immutable.fromJS({
				showEditorService: true,
				status: 0,
			})
		);
	});

	it('關閉 preLoginService', () => {
		const action = {
			type: GET_RECIEVE_FETCH_SERVICE_LIGHTBOX,
			payload: false,
		};

		expect(reducer(undefined, action)).toEqual(
			Immutable.fromJS({
				showEditorService: false,
				status: 0,
			})
		);
	});
});
