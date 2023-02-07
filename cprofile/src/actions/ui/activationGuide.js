// 全新使用者是否顯示 activation
export const CHANGETO_NEW_VISITOR = 'CHANGETO_NEW_VISITOR';
export const changeToNewVisitor = () => ({
	type: CHANGETO_NEW_VISITOR,
});

// 首頁是否顯示服務轉移頁面
export const OPEN_PRELOGIN_SERVICE = 'OPEN_PRELOGIN_SERVICE';
export const openPreloginService = () => ({
	type: OPEN_PRELOGIN_SERVICE,
});

export const CLOSE_PRELOGIN_SERVICE = 'CLOSE_PRELOGIN_SERVICE';
export const closePreloginService = () => ({
	type: CLOSE_PRELOGIN_SERVICE,
});
