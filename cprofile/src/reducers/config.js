import Immutable, { fromJS, Map } from 'immutable';
import { RECIEVE_FETCH_BLOCK_LIST } from 'actions/blocks';
import uuidv4 from 'uuid/v4';
import {
	ADD_CARD,
	ARCHIVE_CARD,
	CHANGE_TEMPLATE,
	SAVE_MASK,
} from 'actions/ui/card';

export const cardRecord = (uniKey = uuidv4(), blockType = 'custom') => {
	const initState = {
		uniKey,
		blockType,
		templateType: 'def',
		visibility: true,
		mask: fromJS({
			def: {
				maskName: 'blackMask',
				maskAlpha: 0,
			},
		}),
	};
	return Immutable.Record(initState);
};

const initState = fromJS({});

const ConfigReducer = (state = initState, action) => {
	switch (action.type) {
		case RECIEVE_FETCH_BLOCK_LIST:
			return Map(
				action.payload.map(elm => {
					const blockInfo = {
						uniKey: elm.blockId,
						blockType: elm.type,
						templateType: elm.template,
						visibility: elm.visibility,
						mask: fromJS(elm.mask || {}).map(elm =>
							Map({ maskName: elm.get('name'), maskAlpha: elm.get('alpha') })
						),
					};
					return [elm.blockId, cardRecord(elm.type)(blockInfo)];
				})
			);

		case ADD_CARD:
			return state.update(action.uniKey, data =>
				data
					? data
							.set('visibility', true)
							.set('templateType', action.templateType)
					: cardRecord(action.uniKey, action.blockType)().set(
							'templateType',
							action.templateType
					  )
			);
		case ARCHIVE_CARD:
			return state.setIn([action.uniKey, 'visibility'], false);

		case CHANGE_TEMPLATE:
			return state.setIn([action.uniKey, 'templateType'], action.templateType);

		case SAVE_MASK: {
			const { uniKey, templateType, maskName, maskAlpha } = action;
			return state
				.setIn([uniKey, 'mask', templateType, 'maskName'], maskName)
				.setIn([uniKey, 'mask', templateType, 'maskAlpha'], maskAlpha);
		}

		default:
			return state;
	}
};

export default ConfigReducer;
