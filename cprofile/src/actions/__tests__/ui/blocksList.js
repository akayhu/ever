/* eslint-disable */
import {
	toggleBlocksListDrag,
	TOGGLE_BLOCKS_LIST_DRAG,
} from 'actions/ui/blocksList';

describe('blocksList actions', () => {
	it('切換拖曳狀態', () => {
		const value = false;
		const dragIndex = null;
		const expectedAction = {
			type: TOGGLE_BLOCKS_LIST_DRAG,
			value,
			dragIndex,
		};
		expect(toggleBlocksListDrag()).toEqual(expectedAction);
	});
});
