import {getMockId, nowTimeObj, broadcastCreateActivity, broadcastSwitchActivity, broadcastDeleteActivity, broadcastUpdateActivity} from './activityCRUD';
import {LOADED_PROFILE_GALLERY_SORT} from './galleryList';
import {requestData, receiveData, receiveCount, receiveFail} from './queryTool';

/**
 * 新增展示櫥窗作品
 */
export const CREATE_GALLERY = 'CREATE_GALLERY';
export const createGallery = (params) => (dispatch, getState) => {
	const mockId = getMockId();
	const fakeActivity = {
		...params,
		aid: mockId,
		aidParent: null,
		pid: getState().user.pid,
		avoidSearched: false,
		collectCount: 0,
		collectIt: false,
		collectList: [],
		commentCount: 0,
		commentList: [],
		contentType: 1,
		createDate: new Date().getTime(),
		createDateStr: nowTimeObj(),
		endorseCount: 0,
		endorseHoneyPot: [],
		endorseIt: false,
		endorseItemCount: 0,
		endorseItemList: [],
		endorsePreferences: [],
		extra: JSON.parse(params.extra) || params.extra,
		extraInfo: JSON.parse(params.extra) || params.extra,
		likeCount: 0,
		likeIt: false,
		likeList: [],
		personalMeta: null,
		representativeFile: null,
		userInfo: getState().user,
		verb: 1,
		viewCount: 0
	};

	dispatch(broadcastCreateActivity(fakeActivity));
	return dispatch({
		'CALL_API': {
			type: CREATE_GALLERY,
			method: 'post',
			target: '/profile/profileGallery/createGallery',
			params: params
		}
	}).then((response) => {
		if(response.response){
			return dispatch(broadcastSwitchActivity(fakeActivity, response.response));
		}else{
			return dispatch(receiveFail(CREATE_GALLERY, response));
		}
	});
}

/**
 * 修改展示櫥窗作品
 */
export const UPDATE_GALLERY = 'UPDATE_GALLERY';
export const updateGallery = (params) => (dispatch, getState) => {
	const oldActivity = getState().activity.activityPool[params.aid];
	const newActivity = JSON.parse(params.activity);
	const fakeActivity = {
		...oldActivity,
		...newActivity
	}; // 這裡 BIGC-1128 這張單 編輯個人作品後消失是因為前端編輯器送出的 <img tagType=\"IMAGE\" fileId=\"d4575abd4ad3453ea75cd0951461daa301\"/> 沒有src 啦
	
	dispatch(broadcastUpdateActivity(fakeActivity));
	return dispatch({
		'CALL_API': {
			type: UPDATE_GALLERY,
			method: 'post',
			target: '/profile/profileGallery/updateGallery',
			params: params
		}
	}).then((response) => {
		if(response.response){
			return dispatch(broadcastUpdateActivity(response.response));
		}else{
			return dispatch(receiveFail(UPDATE_GALLERY, response));
		}
	});
}

/**
 * 刪除展示櫥窗作品
 */
export const DELETE_GALLERY = 'DELETE_GALLERY';
export const deleteGallery = (params) => (dispatch, getState) => {
	const user = getState().user;
	return dispatch({
		'CALL_API': {
			type: DELETE_GALLERY,
			method: 'post',
			target: '/profile/profileGallery/deleteGallery',
			params: {
				galleryId: params.aid,
				pid: user.pid
			}
		}
	}).then((response) => {
		if(response.response && response.response === true){
			return dispatch(broadcastDeleteActivity(params));
		}else{
			return dispatch(receiveFail(DELETE_GALLERY, response));
		}
	});
}

/**
 * 更新展示櫥窗排序
 */
export const UPDATE_GALLERY_SORT = 'UPDATE_GALLERY_SORT';
export const updateGallerySort = (params) => (dispatch, getState) => {
	const jsonArray = [];
	const user = getState().user;
	const activity = getState().activity;
	const gallerysort = activity.gallerysort;
	const allSort = [...gallerysort.top, ...gallerysort.other].reduce((newObj, item, key) => {
		newObj[item.galleryId] = item;
		return newObj;
	}, {});
	let pidAll = activity.personalStream.GALLERY[user.pid].dataList;

	for(let key in params){
		jsonArray.push({
			sortIndex: key,
			galleryId: params[key]
		})
	}

	if(!activity.gallerysort.loading){
		dispatch(requestData('GALLERYSORT'));
		return dispatch({
			'CALL_API': {
				type: UPDATE_GALLERY_SORT,
				method: 'post',
				target: '/profile/profileGallery/updateGallerySort',
				params: {
					jsonArray: JSON.stringify(jsonArray)
				}
			}
		}).then((response) => {
			if(response.response){
				let newDataList = [];
				const otherArray = [];
				const topArray = [];

				for(let key in params){
					topArray.push({
						...allSort[params[key]]
					});
					newDataList.push(params[key]);

					delete allSort[params[key]];
					pidAll = pidAll.filter((aid) => aid !== params[key]);
				}

				for(let keyForAllSort in allSort){
					otherArray.push({
						...allSort[keyForAllSort]
					});
				}

				newDataList = newDataList.concat(pidAll);

				return dispatch(receiveData(
					LOADED_PROFILE_GALLERY_SORT, {
						top: topArray,
						other: otherArray
					},
					{
						dataList: newDataList,
						targetPid: user.pid
					}
				));
			}else{
				return dispatch(receiveFail(UPDATE_GALLERY_SORT, response));
			}
		});
	}else{
		return Promise.resolve();
	}
}
