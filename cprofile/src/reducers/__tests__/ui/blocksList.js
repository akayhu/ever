/* eslint-disable */
import reducer from 'reducers/ui/blocksList';
import { TOGGLE_BLOCKS_LIST_DRAG } from 'actions/ui/blocksList';
import Immutable from 'immutable';

describe('Blocks List 操作', () => {
	test('拖曳區塊列表切換', () => {
		const action = {
			type: TOGGLE_BLOCKS_LIST_DRAG,
			value: true,
			dragIndex: 2,
		};
		expect(reducer(undefined, action)).toEqual(
			Immutable.fromJS({
				isDragging: true,
				dragIndex: 2,
			})
		);
	});
});
