var i = 0
var j = 0
export function getShowItems(appraise, pending, viewas, visitorInList, user) {
	console.info('i:', i++)
	if (viewas === 'self') {
		return pending.appraiseList.slice(0, 1)
			.concat(appraise.appraiseList.filter(item => item.privateSetting !== -1))
			.slice(0, 2);
	} else {
		if (user.isLogin) {
			return appraise.appraiseList.slice(0, (!visitorInList ? 1 : 2));
		} else {
			return appraise.appraiseList.slice(0, 2);
		}
	}
}

export function getLightboxItems(appraise,  appraiseNotSort, viewas) {
	console.info('j:', j++)
	if (viewas === 'self') {
		return appraise.appraiseList;
	} else {
		return appraiseNotSort.appraiseList;
	}
}
