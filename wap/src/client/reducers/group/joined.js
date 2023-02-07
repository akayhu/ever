import { QUERY_JOINED_GROUP_LIST } from '../../actions/group';

export const initListState = {
	dataList: [],
	hasNext: true,
	offset: 0,
	total: 0
};

const joined = (state = initListState, action) => {
	try{
		switch (action.type) {
			case QUERY_JOINED_GROUP_LIST:
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

export default joined;
