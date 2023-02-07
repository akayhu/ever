export const SEARCH_BY_KEYWORD = 'SEARCH_BY_KEYWORD';
export const searchByKeyword = params => ({
	CALL_API: {
		type: SEARCH_BY_KEYWORD,
		method: 'get',
		target: '/search/searchByKeyword',
		params,
	},
});

export const SEARCH_BY_PERSON = 'SEARCH_BY_PERSON';
export const searchByPerson = params => ({
	CALL_API: {
		type: SEARCH_BY_PERSON,
		method: 'get',
		target: '/search/searchPerson',
		params,
	},
});

export const CHANGE_SEARCH_TAB = 'CHANGE_SEARCH_TAB';
export const changeSearchTab = tab => (dispatch, getState) => {
	dispatch({
		type: CHANGE_SEARCH_TAB, payload: {tab},
	});
};
