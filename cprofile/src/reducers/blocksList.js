import { fromJS, List } from 'immutable';
import { RECIEVE_FETCH_BLOCK_LIST } from 'actions/blocks';
import { isUUID } from 'utils/validation';
import {
	ADD_CARD,
	MOVE_CARD,
	ARCHIVE_CARD,
	DELETE_CARD,
	INJECT_PLACEHOLDER,
	REMOVE_PLACEHOLDER,
	PLACEHOLDER_KEY,
	REMOVE_EXTRA_UNIKEY,
	UPDATE_CARD_ORDER,
} from 'actions/ui/card';

const initState = fromJS([]);

const BlocksListReducer = (state = initState, action) => {
	switch (action.type) {
		case RECIEVE_FETCH_BLOCK_LIST:
			return state.update(() =>
				fromJS(action.payload)
					.filter(elm => elm.get('visibility') && elm.get('type') !== 'basic')
					.map(elm => elm.get('blockId'))
			);

		case ADD_CARD:
			return state
				.splice(action.insertIndex, 0, action.uniKey)
				.filter(elm => elm !== PLACEHOLDER_KEY);

		case MOVE_CARD:
			return state
				.filter(elm => elm !== PLACEHOLDER_KEY && elm !== action.uniKey)
				.splice(action.hoverIndex, 0, action.uniKey);

		case UPDATE_CARD_ORDER: {
			if (!Array.isArray(action.orderKeys)) return state;
			if (action.orderKeys.some(key => !isUUID(key))) return state;
			if (action.orderKeys.length !== state.size) return state;
			return List(action.orderKeys);
		}

		case ARCHIVE_CARD:
		case DELETE_CARD:
			return state.filter(elm => elm !== action.uniKey);

		case INJECT_PLACEHOLDER:
			return state
				.filter(elm => elm !== PLACEHOLDER_KEY)
				.splice(action.hoverIndex, 0, PLACEHOLDER_KEY);

		case REMOVE_PLACEHOLDER:
			return state.filter(elm => elm !== PLACEHOLDER_KEY);

		case REMOVE_EXTRA_UNIKEY:
			return state.filter(uniKey => uniKey !== action.uniKey);

		default:
			return state;
	}
};

export default BlocksListReducer;
