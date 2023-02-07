import { RECEIVE_DATA } from '../../actions/group';

export const initListState = 'normal';

const observerRule = (state = initListState, action) => {
	try{
		if (action.category !== 'groupInfo')
			return state;
		switch (action.type) {
			case RECEIVE_DATA: {
				const { isMember, isAdmin, isHead } = action.response;
				if (isHead) return 'Head';
				if (isAdmin) return 'Admin';
				if (isMember) return 'Member';
				return state;
			}
			default:
				return state;
		}
	}catch(e){
		console.log(e)
		return state;
	}
};

export default observerRule;
