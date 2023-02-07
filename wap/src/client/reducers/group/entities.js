import keyBy from 'lodash/keyBy';
import has from 'lodash/has';
import {RECEIVE_DATA, UPDATE_GROUP_INFO} from '../../actions/group';

const handleActionCategories = [
	'joined', 'waitForJoin', 'managed', 'checking', 'rejected',
	'knowAndTech', 'lifestyle', 'healthAndLeisure', 'artAndDesign', 'groupInfo'
];

function getByIds(source) {
	if (has(source, 'dataList')) {
		return keyBy(source.dataList, 'id');
	}
	return {[source.id]: {...source}};
}

export default function entities(state = {}, action) {
	if (action.type !== RECEIVE_DATA && action.type !== UPDATE_GROUP_INFO) return state;
	if (handleActionCategories.indexOf(action.category) === -1) return state;

	return {
		...state,
		...getByIds(action.response),
	};
}
