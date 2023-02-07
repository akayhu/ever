// selector
export const getIsLoading = (state, category) => transByCategory(state, category, 'loading');
export const getCurrentCount = (state, category) => transByCategory(state, category, 'count');
export const getDataList = (state, category) => transByCategory(state, category, 'dataList');
export const getIsError = (state, category) => transByCategory(state, category, 'error');
export const getIsEnd = (state, category) => transByCategory(state, category, 'end');
export const getLastDateTime = (state) => state.messageList.dateTime;
export const getReadingChatId = (state) => state.readingChatId;
export const getIsNewMessage = (state) => state.isNewMessage;
export const getReceivedChatId = (state) => Object.keys(state.chatList);
export const getReceiversId = (state) => state.messageTo;
// utils
const transByCategory = (state, category, key) => {
	if (category === 'chatList') {
		return state[category][getReadingChatId(state)][key];
	}

	return state[category][key];
};
