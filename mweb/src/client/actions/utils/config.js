import {lazyObject} from 'src/util/tools';
import * as ActivityApi from 'src/client/actions/activity';
import * as GroupApi from 'src/client/actions/group';
import * as ChannelApi from 'src/client/actions/channel';
import * as ProfileApi from 'src/client/actions/profile';
import * as TopicApi from 'src/client/actions/topic';
import * as SearchApi from 'src/client/actions/search';
import * as CollectionApi from 'src/client/actions/collection';
import * as NotificationApi from 'src/client/actions/notification';
// domain 和 key 所對應的資訊


// 對應到回傳的資料是activityModel
export const activityModel = {
	topic: lazyObject('hots'),
	main: lazyObject('hot', 'latest', 'all'),
	profile: lazyObject('activity'),
	group: lazyObject('activity'),
	channel: lazyObject('activity'),
	search: lazyObject('activity'),
	collection: lazyObject('activity'),
};

// 對應到回傳的資料是channelModel
export const channelModel = {
	group: lazyObject('joined', 'waitForJoin', 'managed', 'checking', 'rejected'),
	channel: lazyObject('all', 'recommend', 'joined'),
};

// 對應要呼叫的API
export const actionMapping = {
	main: {
		all: ActivityApi.getPersonalRiverAll,
		hot: ActivityApi.getPersonallRiverHot,
		latest: ActivityApi.getPersonallRiverNew,
	},
	group: {
		activity: ActivityApi.getActivityListByChannel,
		member: GroupApi.queryGroupMemberList,
		all: GroupApi.queryGroupListByCategory,
		joined: GroupApi.queryJoinedGroupList,
		waitForJoin: GroupApi.queryJoinedGroupList,
		managed: GroupApi.queryManageGroupListByStatus,
		checking: GroupApi.queryManageGroupListByStatus,
		rejected: GroupApi.queryManageGroupListByStatus,
	},
	channel: {
		activity: ActivityApi.getActivityListByChannel,
		member: ChannelApi.getChannelMemberList,
		all: ChannelApi.getChannelList,
		recommend: ChannelApi.getChannelList,
		joined: ChannelApi.getSubscribeChannelList
	},
	profile: {
		activity: ActivityApi.getPersonalWall,
		gallery: ProfileApi.getGalleryList,
		appraise: {
			self: ProfileApi.queryAppraiseListOfOwner,
			others: ProfileApi.queryAppraiseList,
		},
		endorse: ProfileApi.getEndorseList,
		colleague: ProfileApi.queryColleagueList,
	},
	topic: {
		hots: TopicApi.getWorkspaceListHot,
	},
	search: {
		activity: SearchApi.searchByKeyword,
		person: SearchApi.searchByPerson,
	},
	collection: {
		activity: CollectionApi.getCollectList,
	},
	notification: {
		bc: NotificationApi.getNotificationBCList,
		cc: NotificationApi.getNotificationCCList,
	},
};
