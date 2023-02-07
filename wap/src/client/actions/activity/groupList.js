import {requestData, receiveData, receiveCount, receiveFail} from './queryTool';


export const GET_GROUP_ACTIVITY_FOR_CHECK = 'GET_GROUP_ACTIVITY_FOR_CHECK';
export const getGroupActivityForCheck = () => (dispatch, getState) => {
	const activity = getState().activity;
	
	if(!activity.gallerysort.loading && !activity.gallerysort.end){
		dispatch(requestData('GALLERYSORT'));
		return dispatch({
			'CALL_API': {
				type: LOADED_PROFILE_GALLERY_SORT,
				method: 'get',
				target: '/profile/profileGallery/getGallerySortList',
				params: {}
			}
		}).then((response) => {
			if(response.response){
				return dispatch(receiveData(LOADED_PROFILE_GALLERY_SORT, response.response));
			}else{
				return dispatch(receiveFail(LOADED_PROFILE_GALLERY_SORT, response));
			}
		});
	}else{
		return Promise.resolve();
	}
};


