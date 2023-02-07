import reducer from 'reducers/ui/reorder';
import { TOGGLE_REORDER_CONFIRM } from 'actions/ui/reorder';

import Immutable from 'immutable';

describe(' visibility 切換', () => {
	it('打開 visibility', () => {
		const action = {
			type: TOGGLE_REORDER_CONFIRM,
			visibility: true,
		};

		expect(reducer(undefined, action)).toEqual(
			Immutable.fromJS({
				visibility: true,
			})
		);
	});

	it('關閉 visibility', () => {
		const action = {
			type: TOGGLE_REORDER_CONFIRM,
			visibility: false,
		};

		expect(reducer(undefined, action)).toEqual(
			Immutable.fromJS({
				visibility: false,
			})
		);
	});
});
