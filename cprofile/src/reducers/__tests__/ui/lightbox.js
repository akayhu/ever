/* eslint-disable */
import reducer from 'reducers/ui/lightbox';
import { LIGHTBOX_OPEN, LIGHTBOX_CLOSE } from 'actions/ui/lightbox';
import Immutable from 'immutable';

describe('Lightbox 操作', () => {
	test('打開 Lightbox', () => {
		const action = {
			type: LIGHTBOX_OPEN,
		};
		expect(reducer(undefined, action)).toEqual(
			Immutable.fromJS({
				visible: true,
			})
		);
	});

	test('關閉 Lightbox', () => {
		const action = {
			type: LIGHTBOX_CLOSE,
		};
		expect(reducer(undefined, action)).toEqual(
			Immutable.fromJS({
				visible: false,
			})
		);
	});
});
