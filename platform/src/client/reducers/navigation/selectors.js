export const getInviteData = (state) => {
  return state.navigation.connection.inviteList.dataList;
};

export const getBubbleCount = (state, type) => {
  return state.navigation.bubbles[type] || 0;
};

export const getMsgData = (state) => {
  return state.navigation.bcCommunication.msgList.msgListData;
};

export const getCcMessageData = (state) => {
  return state.navigation.ccCommunication.messageList.dataList;
};

export const getNotificationDataById = (state) => {
  return state.navigation.notification.notificationList.dataList;
};

export const getIsEmptyByDomain = (state, domain) => state.navigation[domain].empty;
