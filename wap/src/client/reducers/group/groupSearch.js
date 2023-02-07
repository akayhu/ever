import { TRIGGER_SEARCH, CLEAR_SEARCH } from '../../actions/group';

export const initialState = {
	memberKeyWord: '',
	activityKeyWord: ''
}

const groupSearch = (state = initialState, {type, category, keyword}) => {
	try{
		if (type !== CLEAR_SEARCH) {
			if (category !== 'searchMembers' && category !== 'searchActivity')
				return state;
		}

		const label = (category === 'searchMembers') ? 'memberKeyWord' : 'activityKeyWord';

		switch (type) {
			case TRIGGER_SEARCH:
				return {...state, [label]: keyword};
			case CLEAR_SEARCH:
				return initialState;
			default:
				return state;
		}
	}catch(e){
		console.log(e)
		return state;
	}
};

export default groupSearch;
