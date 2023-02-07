import { QUERY_MANAGED_GROUP_LIST_BY_STATUS } from '../../actions/group';

export const initListState = {
	dataList: [],
	hasNext: true,
	offset: 0,
	total: 0
};

const created = (state = initListState, action) => {
	try{
		switch (action.type) {
			case QUERY_MANAGED_GROUP_LIST_BY_STATUS:
				if (action.response === null || !action.response.response) return state;
				return action.response.response;
			default:
				return state;
		}
	}catch(e){
		console.log(e)
		return state;
	}
};

export default created;
