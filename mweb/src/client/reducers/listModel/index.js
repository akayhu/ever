export const baseListModel = {
	dataList: [],
	error: false,
	loading: false,
	offset: 0,
	end: false,
	hasLoaded: false,
	total: 0
};

export const topicModel = {
	hots: baseListModel,
};

export const channelModel = {
	activity: baseListModel,
	member: baseListModel,
	channelInfo: {},
	hasLoaded: false,
};

export const profileModel = {
	userInfo: {},
	guest: {
		total: 0,
		user: {
			count: 0,
			dataList: [],
		},
		comp: {
			count: 0,
			dataList: [],
		},
	},
	event: {
		exp: [],
		edu: [],
		honor: [],
	},
	gallery: baseListModel,
	endorse: baseListModel,
	appraise: baseListModel,
	colleague: baseListModel,
	activity: baseListModel,
	hasLoaded: false,
	profileIsEmpty: true,
};
