/* eslint-disable */
import {
	CHANGE_SHOWTAG,
	changeShowTag,
	changeBox,
	CHANGE_BOX,
} from 'actions/ui/factory';

describe('factory actions', () => {
	it('變更顯示 tag', () => {
		const tag = 'tag';
		const expectedAction = {
			type: CHANGE_SHOWTAG,
			tag,
		};
		expect(changeShowTag(tag)).toEqual(expectedAction);
	});

	it('變更顯示 tag', () => {
		const tag = 'tag';
		const expectedAction = {
			type: CHANGE_BOX,
			tag,
		};
		expect(changeBox(tag)).toEqual(expectedAction);
	});
});
