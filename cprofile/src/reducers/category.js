import { Map, fromJS } from 'immutable';
import { validCategory } from 'config/category';
import { SAVE_CATEGORY_JSON } from 'actions/category';
import { flatCategoryJSON } from 'utils/category';

const initState = Map();

// 類目選單 JSON 存入 state
const saveCategoryJSON = (state, action) => {
	const { category, payload } = action;
	if (!validCategory.includes(category)) return state;
	return state.set(category, fromJS(flatCategoryJSON(payload)));
};

const CategoryReducer = (state = initState, action) => {
	switch (action.type) {
		case SAVE_CATEGORY_JSON: // 類目選單 JSON 存入 state
			return saveCategoryJSON(state, action);
		default:
			return state;
	}
};

export default CategoryReducer;
