import {combineReducers} from 'redux';
import channels from './channelEntity';
import activities from './activityEntity';
import profiles from './profileEntity';

/**
 * {
			channels: {
				8401: {
					activity: {
						dataList: [<Array of aid>],
						end: false,
						error: false,
						hasLoaded: true,
						loading: false,
						offset: 1471506821600
					},
					member: {
						dataList: [<Array of NameCardModel>],
						end: false,
						error: false,
						hasLoaded: true,
						loading: false,
						offset: 10
					},
					...otherChannelInfo,
				}
			},
			activities: {
				"0b88bf2f-44da-4ae5-bd36-896b92e99220": {activityInfo},
				"c74f5a64-2c59-4ace-b9ff-e6813052da85": {activityInfo},
			},
			profiles: {
				108190: {
					userInfo: {},
					activity: {},
					appraise: {},
					colleague: {},
					endorse: {},
					event: {},
					gallery: {},
					guest: [],
					hasLoaded: false,
				}
			},
		}
 */

export default combineReducers({
	channels,
	activities,
	profiles,
});

// selector
export const getGuestCount = ({profiles}, targetPid) => profiles[targetPid] ? profiles[targetPid].guest.total : 0;
export const getGuestDataOfUser = ({profiles}, targetPid) => profiles[targetPid] ? profiles[targetPid].guest.user : {};
export const getGuestDataOfComp = ({profiles}, targetPid) => profiles[targetPid] ? profiles[targetPid].guest.comp : {};
