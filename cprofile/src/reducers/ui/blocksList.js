import { fromJS } from 'immutable';
import { MOVE_CARD, INJECT_PLACEHOLDER } from 'actions/ui/card';
import { TOGGLE_BLOCKS_LIST_DRAG } from 'actions/ui/blocksList';

export const initState = fromJS({
	isDragging: false,
	dragIndex: null,
});

const BlocksListReducer = (state = initState, action) => {
	switch (action.type) {
		case MOVE_CARD: {
			return state.set('dragIndex', action.hoverIndex);
		}
		case INJECT_PLACEHOLDER: {
			return state.set('dragIndex', action.hoverIndex);
		}
		case TOGGLE_BLOCKS_LIST_DRAG: {
			return state
				.set('isDragging', action.value)
				.set('dragIndex', action.dragIndex);
		}

		default:
			return state;
	}
};

export default BlocksListReducer;
