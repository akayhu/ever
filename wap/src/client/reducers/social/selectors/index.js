import { createSelector } from 'reselect';
import _ from 'lodash';

const getAppraiseList = (state) => state.social.appraise.appraiseList
const getAppraiseNotSort = (state) => state.social.appraiseNotSort.appraiseList
const getPendingList = (state) => state.social.pending.appraiseList
export const getVisitorInList = (state) => state.social.appraise.visitorInList
const getViewAs = (state) => state.profile.viewas
const getIsLogin = (state) => state.user.isLogin

export const getShowItems = createSelector(
  [getAppraiseList, getPendingList, getViewAs, getVisitorInList, getIsLogin],
  (appraise, pending, viewas, visitorInList, isLogin) => {
    	let returnList = null;
      
      if (viewas === 'self') {
        const firstPending = _.head(pending)||[];
        const confirmedList = _.filter(appraise, item => item.privateSetting !== -1);
        const combinedList = _.concat(firstPending, confirmedList);
    		returnList = _.take(combinedList, 2);
    	} else {
    		if (isLogin) {
          // 有讚美過只取一筆，沒有擇取兩筆
          const pickNumber = !visitorInList ? 1 : 2
    			returnList = _.take(appraise, pickNumber);
    		} else {
    			returnList = _.take(appraise, 2)
    		}
    	}
      
      return returnList.filter((item)=>{return !!item;});
  }
)

export const getLightboxItems = createSelector(
  [getAppraiseList, getAppraiseNotSort, getViewAs],
  (appraise, appraiseNotSort, viewas) => {
    	if (viewas === 'self') {
    		return appraise;
    	} else {
    		return appraiseNotSort;
    	}
  }
)

export const getAppraiseSize = (state) => state.social.appraise.listSize;
export const getAppraiseLastTime = (state) => state.social.appraise.lastTimeInMillis
// getLightboxItems(state.social.appraise, state.social.appraiseNotSort, state.profile.viewas),
// getShowItems(state.social.appraise, state.social.pending, state.profile.viewas, state.social.appraise.visitorInList, state.user),
// export function getLightboxItems(appraise,  appraiseNotSort, viewas) {
// 	if (viewas === 'self') {
// 		return appraise.appraiseList;
// 	} else {
// 		return appraiseNotSort.appraiseList;
// 	}
// }
// export function getShowItems(appraise, pending, viewas, visitorInList, user) {
// 	if (viewas === 'self') {
// 		return pending.appraiseList.slice(0, 1)
// 			.concat(appraise.appraiseList.filter(item => item.privateSetting !== -1))
// 			.slice(0, 2);
// 	} else {
// 		if (user.isLogin) {
// 			return appraise.appraiseList.slice(0, (!visitorInList ? 1 : 2));
// 		} else {
// 			return appraise.appraiseList.slice(0, 2);
// 		}
// 	}
// }
//
